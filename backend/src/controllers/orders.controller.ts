import { Request, Response } from "express";
import { driver } from "../config/db";

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session()

  try {
    const result = await session.run(`
      MATCH (o)
      WHERE o:Order OR o:Urgent OR o:Recurrent
      RETURN o, labels(o) AS labels
    `)

    const orders = result.records.map(record => {
      const properties = record.get("o").properties
      const labels = record.get("labels")

      const tipo: string[] = labels.filter((label: string) => ["Order", "Urgent", "Recurrent"].includes(label))

      return {
        id: properties.id,
        fecha: properties.fecha_orden,
        total: properties.costo_total,
        tipo,
        cantidad: properties.cantidad,
        estado: properties.estado
      }
    })

    res.json(orders)
  } catch (error) {
    console.error("Error obteniendo ordenes:", error)
    res.status(500).json({ error: "Error obteniendo ordenes" })
  } finally {
    await session.close()
  }
}

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
  const session = driver.session();
  const { ID, fechaOrden, cantidad, estado, costoTotal } = req.body;
  try {
    await session.run(
      `CREATE (:Order {ID: $ID, fechaOrden: date($fechaOrden), cantidad: $cantidad, estado: $estado, costoTotal: $costoTotal})`,
      { ID, fechaOrden, cantidad, estado, costoTotal }
    );
    res.json({ message: "Orden creada" });
  } catch (error) {
    console.error("Error creando orden:", error);
    res.status(500).json({ error: "Error creando orden" });
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
