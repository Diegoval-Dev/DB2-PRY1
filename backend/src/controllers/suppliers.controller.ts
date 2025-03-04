import { Request, Response } from "express";
import { driver } from "../config/db";

export const getAllSuppliers = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session()

  try {
    const result = await session.run(`
      MATCH (s)
      WHERE s:Supplier OR s:Distributor OR s:Wholesaler
      RETURN s, labels(s) AS labels
    `)

    const suppliers = result.records.map(record => {
      const properties = record.get("s").properties
      const labels: string[] = record.get("labels")

      // Filtramos solo las etiquetas validas como tipo
      const tiposValidos = labels.filter(label => ["Supplier", "Distributor", "Wholesaler"].includes(label))

      return {
        id: properties.id,
        ubicación: properties.ubicación,
        nombre: properties.nombre,
        calificación: properties.calificación,
        tipo: tiposValidos
      }
    })

    res.json(suppliers)
  } catch (error) {
    console.error("Error obteniendo proveedores:", error)
    res.status(500).json({ error: "Error obteniendo proveedores" })
  } finally {
    await session.close()
  }
}

export const getSupplierById = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (s:Supplier {ID: $id}) RETURN s`, { id: req.params.id });
    if (result.records.length === 0) {
      res.status(404).json({ error: "Proveedor no encontrado" });
      return;
    }
    res.json(result.records[0].get("s").properties);
  } catch (error) {
    console.error("Error obteniendo proveedor:", error);
    res.status(500).json({ error: "Error obteniendo proveedor" });
  } finally {
    await session.close();
  }
};

export const createSupplier = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  const { id, nombre, ubicación, calificación, tipo } = req.body;

  if (!Array.isArray(tipo) || tipo.length === 0) {
    res.status(400).json({ error: "Debe especificar al menos un tipo" });
    return;
  }

  const labels = tipo.map(t => `\`${t}\``).join(":"); 

  const query = `
    CREATE (s:${labels} {id: $id, nombre: $nombre, ubicación: $ubicación, calificación: $calificación})
  `;

  try {
    await session.run(query, { id, nombre, ubicación, calificación });
    res.json({ message: "Proveedor creado" });
  } catch (error) {
    console.error("Error creando proveedor:", error);
    res.status(500).json({ error: "Error creando proveedor" });
  } finally {
    await session.close();
  }
};


export const updateSupplier = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  const { nombre, ubicación, calificación } = req.body;
  try {
    await session.run(
      `MATCH (s:Supplier {ID: $id}) 
       SET s.nombre = $nombre, s.ubicación = $ubicación, s.calificación = $calificación 
       RETURN s`,
      { id: req.params.id, nombre, ubicación, calificación }
    );
    res.json({ message: "Proveedor actualizado" });
  } catch (error) {
    console.error("Error actualizando proveedor:", error);
    res.status(500).json({ error: "Error actualizando proveedor" });
  } finally {
    await session.close();
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  const { id } = req.params
  const session = driver.session()

  try {
      const query = `
          MATCH (s:Supplier {id: $id})
          DETACH DELETE s
      `

      const result = await session.run(query, { id })

      if (result.summary.counters.updates().nodesDeleted === 0) {
          res.status(404).json({ error: "Proveedor no encontrado" })
          return
      }

      res.json({ message: "Proveedor eliminado correctamente" })
  } catch (error) {
      console.error("Error eliminando supplier:", error)
      res.status(500).json({ error: "Error eliminando supplier" })
  } finally {
      await session.close()
  }
}

export const updateSupplies = async (req: Request, res: Response) => {
  const session = driver.session();
  const { id } = req.params;
  const { supplies } = req.body;

  if (!Array.isArray(supplies) || supplies.length === 0) {
      res.status(400).json({ error: "Debe especificar al menos un producto suministrado" });
      return;
  }

  try {

      const supplierCheck = await session.run(
          `MATCH (s:Supplier {id: $id}) RETURN s`,
          { id }
      );
      if (supplierCheck.records.length === 0) {
          res.status(404).json({ error: "Proveedor no encontrado" });
          return;
      }

      await session.run(
          `MATCH (s:Supplier {id: $id})-[r:SUPPLIES]->(:Ingredient) DELETE r`,
          { id }
      );

      for (const supply of supplies) {
          const { ingredientId, cantidad, fecha } = supply;

          const ingredientCheck = await session.run(
              `MATCH (i:Ingredient {id: $ingredientId}) RETURN i`,
              { ingredientId }
          );
          if (ingredientCheck.records.length === 0) {
              res.status(400).json({ error: `El ingrediente con ID ${ingredientId} no existe` });
              return;
          }

          await session.run(
              `
              MATCH (s:Supplier {id: $id})
              MATCH (i:Ingredient {id: $ingredientId})
              CREATE (s)-[:SUPPLIES {cantidad: toInteger($cantidad), fecha: date($fecha)}]->(i)
              `,
              { id, ingredientId, cantidad, fecha }
          );
      }

      res.json({ message: "Relaciones de suministro actualizadas correctamente" });
  } catch (error) {
      console.error("Error actualizando suministros:", error);
      res.status(500).json({ error: "Error actualizando suministros" });
  } finally {
      await session.close();
  }
};

export const updateSupplierProperty = async (req: Request, res: Response) => {
  const { id } = req.params
  const { nombre, ubicación, calificación } = req.body 

  const session = driver.session()

  try {
      const query = `
          MATCH (s:Supplier {id: $id})
          SET ${nombre ? 's.nombre = $nombre,' : ''}
              ${ubicación ? 's.ubicación = $ubicación,' : ''}
              ${calificación ? 's.calificación = toFloat($calificación),' : ''}
          s._lastUpdated = datetime()
      `

      await session.run(query, { id, nombre, ubicación, calificación })

      res.json({ message: "Propiedades actualizadas correctamente" })
  } catch (error) {
      console.error("Error actualizando supplier:", error)
      res.status(500).json({ error: "Error actualizando supplier" })
  } finally {
      await session.close()
  }
}

export const getSupplierSupplies = async (req: Request, res: Response) => {
  const session = driver.session()
  const { id } = req.params

  console.log(`📡 Buscando suministros para el proveedor con id: ${id}`)

  try {
      const query = `
          MATCH (s:Supplier {id: $id})- [r:SUPPLIES] -> (i:Ingredient)
          RETURN i.id AS ingredientId, r.cantidad AS cantidad, toString(r.fecha) AS fecha
      `
      const result = await session.run(query, { id })

      console.log(`🔎 Query ejecutada. Total de relaciones encontradas: ${result.records.length}`)

      if (result.records.length === 0) {
          res.json([]) // Proveedor existe, pero no tiene suministros
          return
      }

      const supplies = result.records.map(record => ({
        ingredientId: record.get("ingredientId"),
        cantidad: parseFloat(record.get("cantidad")),  // <- Esto es lo correcto
        fecha: record.get("fecha")
    }))
      console.log("✅ Suministros encontrados:", supplies)

      res.json(supplies)
  } catch (error) {
      console.error("❌ Error obteniendo suministros del proveedor:", error)
      res.status(500).json({ error: "Error obteniendo suministros del proveedor" })
  } finally {
      await session.close()
  }
}

export const deleteMultipleSuppliers = async (req: Request, res: Response) => {
  const session = driver.session()
  const { ids } = req.body 

  if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: "Debe proporcionar al menos un ID" })
      return
  }

  try {
      const query = `
          UNWIND $ids AS supplierId
          MATCH (s:Supplier {id: supplierId})
          DETACH DELETE s
      `
      await session.run(query, { ids })
      res.json({ message: "Proveedores eliminados correctamente" })
  } catch (error) {
      console.error("Error eliminando proveedores:", error)
      res.status(500).json({ error: "Error eliminando proveedores" })
  } finally {
      await session.close()
  }
}
