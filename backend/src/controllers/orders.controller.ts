import { Request, Response } from "express";
import { driver } from "../config/db";
import { Session, Transaction } from "neo4j-driver";

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (o:Order) RETURN o`);
    const orders = result.records.map(record => record.get("o").properties);
    res.json(orders);
  } catch (error) {
    console.error("Error obteniendo órdenes:", error);
    res.status(500).json({ error: "Error obteniendo órdenes" });
  } finally {
    await session.close();
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (o:Order {ID: $id}) RETURN o`, { id: req.params.id });

    if (result.records.length === 0) {
      res.status(404).json({ error: "Orden no encontrada" });
      return;
    }

    res.json(result.records[0].get("o").properties);
  } catch (error) {
    console.error("Error obteniendo orden:", error);
    res.status(500).json({ error: "Error obteniendo orden" });
  } finally {
    await session.close();
  }
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const {
    orderID,
    orderType,
    fechaOrden,
    estado,
    restaurantName,
    ingredientes
  } = req.body;

  if (!orderID || !orderType || !fechaOrden || !estado || !restaurantName || !ingredientes?.length) {
    res.status(400).json({ error: 'Faltan datos obligatorios para crear la orden.' });
    return;
  }

  const session: Session = driver.session();
  const txc: Transaction = session.beginTransaction();

  let resumenOrden: any[] = [];
  let costoTotal = 0;

  try {
    // 1. Crear el nodo de la Orden con las etiquetas correspondientes (Order + Urgent/Recurrent, etc.)
    await txc.run(
      `
      CREATE (o:Order:${orderType} {
        id: $orderID,
        fechaOrden: date($fechaOrden),
        estado: $estado,
        cantidad: 0,
        costoTotal: 0.0
      })
      `,
      { orderID, orderType, fechaOrden, estado }
    );

    // 2. Calcular la cantidad total de la orden
    const cantidadTotal = ingredientes.reduce(
      (acc: number, curr: any) => acc + curr.cantidad,
      0
    );

    // 3. Buscar el restaurante (nodo Location:Restaurant) por su nombre
    const restaurantResult = await txc.run(
      `
      MATCH (loc:Location:Restaurant {nombre: $restaurantName})
      RETURN loc
      `,
      { restaurantName }
    );
    if (restaurantResult.records.length === 0) {
      throw new Error(`No existe un restaurante con el nombre ${restaurantName}.`);
    }

    // 4. Buscar el inventario asociado al restaurante que tenga capacidad disponible
    const invResult = await txc.run(
      `
      MATCH (inv:Inventory)-[:LOCATED_IN]->(loc:Location:Restaurant {nombre: $restaurantName})
      WHERE inv.capacidad - inv.cantidad_insumos >= $cantidadTotal
      RETURN inv
      ORDER BY (inv.capacidad - inv.cantidadAlmacenada) ASC
      LIMIT 1
      `,
      { restaurantName, cantidadTotal }
    );

    if (invResult.records.length === 0) {
      throw new Error(
        `No se encontró un inventario disponible para el restaurante ${restaurantName} que pueda almacenar ${cantidadTotal} unidades.`
      );
    }
    const suitableInv = invResult.records[0].get('inv');
    const destinoID = suitableInv.properties.id;

    // 5. Verificar que el destino (inventario) exista
    const destinoResult = await txc.run(
      `
      MATCH (dest {id: $destinoID})
      RETURN dest
      `,
      { destinoID }
    );
    if (destinoResult.records.length === 0) {
      throw new Error(`No existe un destino con ID ${destinoID}.`);
    }

    // 6. Procesar cada ingrediente: asignar proveedores (incluso múltiples) y actualizar stocks
    for (const item of ingredientes) {
      const { ingredientID, cantidad } = item;
      let cantidadRestante = cantidad;

      // a) Obtener información del ingrediente
      const ingResult = await txc.run(
        `
        MATCH (i:Ingredient {id: $ingredientID})
        RETURN i.nombre AS nombre, i.precio AS precio, i.fecha_caducidad AS caducidad
        `,
        { ingredientID }
      );
      if (ingResult.records.length === 0) {
        throw new Error(`El ingrediente con ID ${ingredientID} no existe.`);
      }
      const ingRecord = ingResult.records[0];
      const nombreIng = ingRecord.get('nombre');
      const precioUnitario = ingRecord.get('precio');
      const caducidadIng = ingRecord.get('caducidad');

      // b) Mientras falte cubrir la cantidad solicitada, se buscan proveedores
      while (cantidadRestante > 0) {
        const provResult = await txc.run(
          `
          MATCH (s:Supplier)-[r:SUPPLIES]->(i:Ingredient {id: $ingredientID})
          WHERE r.cantidad > 0
          WITH s, r
          ORDER BY s.calificación DESC
          RETURN s, r
          LIMIT 1
          `,
          { ingredientID }
        );

        if (provResult.records.length === 0) {
          throw new Error(
            `No hay más proveedores con stock para ${nombreIng}. Faltan ${cantidadRestante} unidades por cubrir.`
          );
        }

        const supplierNode = provResult.records[0].get('s');
        const supplyRel = provResult.records[0].get('r');
        const bestSupplierID = supplierNode.properties.id;
        const stockDisponible = supplyRel.properties.cantidad;

        // c) Calcular la cantidad que se puede tomar de este proveedor
        const cantidadTomada = Math.min(stockDisponible, cantidadRestante);
        cantidadRestante -= cantidadTomada;

        // d) Actualizar stock en la relación SUPPLIES y en el nodo Ingredient
        await txc.run(
          `
          MATCH (s:Supplier {id: $bestSupplierID})-[r:SUPPLIES]->(i:Ingredient {id: $ingredientID})
          SET r.cantidad = r.cantidad - $cantidadTomada
          WITH i
          SET i.cantidad = i.cantidad - $cantidadTomada
          `,
          { bestSupplierID, ingredientID, cantidadTomada }
        );

        // e) Crear relación CONTAINS entre la Orden y el Ingredient (puede haber varias si se usan distintos proveedores)
        await txc.run(
          `
          MATCH (o:Order {id: $orderID}), (i:Ingredient {id: $ingredientID})
          CREATE (o)-[:CONTAINS { cantidad: $cantidadTomada }]->(i)
          `,
          { orderID, ingredientID, cantidadTomada }
        );

        // f) Asociar el proveedor a la Orden mediante HAS_ORDER y SHIPPED_BY
        await txc.run(
          `
          MATCH (o:Order {id: $orderID}), (s:Supplier {id: $bestSupplierID})
          MERGE (s)-[ho:HAS_ORDER]->(o)
          ON CREATE SET ho.estado = $estado
          MERGE (o)-[sb:SHIPPED_BY]->(s)
          `,
          { orderID, bestSupplierID, estado }
        );

        // g) Calcular subtotal y acumular el costo total
        const subtotal = precioUnitario * cantidadTomada;
        costoTotal += subtotal;

        // h) Agregar información al resumen de la orden
        resumenOrden.push({
          ingrediente: nombreIng,
          proveedor: supplierNode.properties.nombre,
          caducidad: caducidadIng?.toString() ?? null,
          cantidad: cantidadTomada,
          precio: precioUnitario,
          subtotal
        });
      }
    }

    // 7. Relacionar la Orden con el destino (inventario) mediante DELIVERED_TO
    await txc.run(
      `
      MATCH (o:Order {id: $orderID}), (dest:Inventory {id: $destinoID})
      MERGE (o)-[d:DELIVERED_TO]->(dest)
      `,
      { orderID, destinoID }
    );

    // 8. Actualizar la cantidad almacenada en el inventario (destino)
    await txc.run(
      `
      MATCH (inv:Inventory {id: $destinoID})
      SET inv.cantidad_insumo = inv.cantidad_insumo + $cantidadTotal
      `,
      { destinoID, cantidadTotal }
    );

    // 9. Actualizar la Orden con el costo total y la cantidad total
    await txc.run(
      `
      MATCH (o:Order {id: $orderID})
      SET o.costoTotal = $costoTotal,
          o.cantidad = $cantidadTotal
      `,
      { orderID, costoTotal, cantidadTotal }
    );

    // 10. Confirmar la transacción
    await txc.commit();

    res.status(201).json({
      orderID,
      orderType,
      fechaOrden,
      estado,
      destinoID,
      costoTotal,
      detalles: resumenOrden
    });
  } catch (error: any) {
    console.error('Error al crear la orden:', error);
    await txc.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  const { fechaOrden, cantidad, estado, costoTotal } = req.body;
  try {
    await session.run(
      `MATCH (o:Order {ID: $id}) 
       SET o.fechaOrden = date($fechaOrden), o.cantidad = $cantidad, o.estado = $estado, o.costoTotal = $costoTotal 
       RETURN o`,
      { id: req.params.id, fechaOrden, cantidad, estado, costoTotal }
    );
    res.json({ message: "Orden actualizada" });
  } catch (error) {
    console.error("Error actualizando orden:", error);
    res.status(500).json({ error: "Error actualizando orden" });
  } finally {
    await session.close();
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  try {
    await session.run(`MATCH (o:Order {ID: $id}) DETACH DELETE o`, { id: req.params.id });
    res.json({ message: "Orden eliminada" });
  } catch (error) {
    console.error("Error eliminando orden:", error);
    res.status(500).json({ error: "Error eliminando orden" });
  } finally {
    await session.close();
  }
};

