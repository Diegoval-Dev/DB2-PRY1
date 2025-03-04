import { Request, Response } from "express";
import { driver } from "../config/db";
export const getAllInventories = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session()

  try {
    const result = await session.run(`
      MATCH (inv)
      WHERE inv:Inventory OR inv:ColdStorage OR inv:DryStorage
      RETURN inv, labels(inv) AS labels
    `)

    const inventories = result.records.map(record => {
      const properties = record.get("inv").properties
      const labels = record.get("labels")

      const tipo: string[] = labels.filter((label: string) => ["Inventory", "ColdStorage", "DryStorage"].includes(label))

      return {
        id: properties.id,
        descripcion: properties.descripcion,
        capacidad: properties.capacidad,
        ubicacion: properties.ubicación,
        cantidadInsumo: properties.cantidad_insumos,
        tipo
      }
    })

    res.json(inventories)
  } catch (error) {
    console.error("Error obteniendo inventarios:", error)
    res.status(500).json({ error: "Error obteniendo inventarios" })
  } finally {
    await session.close()
  }
}

export const getInventoryById = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (inv:Inventory {ID: $id}) RETURN inv`, { id: req.params.id });
    if (result.records.length === 0) {
      res.status(404).json({ error: "Inventario no encontrado" });
      return;
    }
    res.json(result.records[0].get("inv").properties);
  } catch (error) {
    console.error("Error obteniendo inventario:", error);
    res.status(500).json({ error: "Error obteniendo inventario" });
  } finally {
    await session.close();
  }
};

export const createInventory = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();

  const { id, capacidad, cantidadInsumo, tipo, ubicacion } = req.body;

  try {
      const locationResult = await session.run(
          `MATCH (loc:Location {id: $ubicacion}) RETURN loc.nombre AS nombre`,
          { ubicacion }
      );

      if (locationResult.records.length === 0) {
          res.status(400).json({ error: "Ubicación no encontrada" });
          return;
      }

      const nombreUbicacion = locationResult.records[0].get("nombre");

      const labels: string = tipo.map((t: string) => `\`${t}\``).join(":");

      await session.run(
          `
          CREATE (inv:${labels} {id: $id, capacidad: toFloat($capacidad), cantidadInsumo: toFloat($cantidadInsumo), ubicación: $ubicacion})
          `,
          { id, capacidad, cantidadInsumo, ubicacion: nombreUbicacion }
      );

      await session.run(
          `
          MATCH (inv {id: $id})
          MATCH (loc:Location {id: $ubicacion})
          CREATE (inv)-[:LOCATED_IN {ciudad: loc.nombre}]->(loc)
          `,
          { id, ubicacion }
      );

      res.json({ message: "Inventario creado" });
  } catch (error) {
      console.error("Error creando inventario:", error);
      res.status(500).json({ error: "Error creando inventario" });
  } finally {
      await session.close();
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  const { id } = req.params
  const { descripcion, capacidad, cantidadInsumo } = req.body

  const session = driver.session()

  try {
      const query = `
          MATCH (inv:Inventory {id: $id})
          SET ${descripcion !== undefined ? "inv.descripcion = $descripcion," : ""}
              ${capacidad !== undefined ? "inv.capacidad = toFloat($capacidad)," : ""}
              ${cantidadInsumo !== undefined ? "inv.cantidadInsumo = toInteger($cantidadInsumo)," : ""}
              inv._lastUpdated = datetime()
      `
      const cleanedQuery = query.replace(/,\s*$/g, "") // Elimina coma final si aplica

      const result = await session.run(cleanedQuery, {
          id,
          descripcion,
          capacidad,
          cantidadInsumo
      })

      if (result.summary.counters.updates().propertiesSet === 0) {
          res.status(404).json({ error: "Inventario no encontrado o sin cambios aplicados" })
          return
      }

      res.json({ message: "Inventario actualizado correctamente" })
  } catch (error) {
      console.error("Error actualizando inventario:", error)
      res.status(500).json({ error: "Error actualizando inventario" })
  } finally {
      await session.close()
  }
}

export const deleteInventory = async (req: Request, res: Response) => {
  const { id } = req.params
  const session = driver.session()

  try {
      const query = `
          MATCH (inv:Inventory {id: $id})
          DETACH DELETE inv
      `

      const result = await session.run(query, { id })

      if (result.summary.counters.updates().nodesDeleted === 0) {
          res.status(404).json({ error: "Inventario no encontrado" })
          return
      }

      res.json({ message: "Inventario eliminado correctamente" })
  } catch (error) {
      console.error("Error eliminando inventario:", error)
      res.status(500).json({ error: "Error eliminando inventario" })
  } finally {
      await session.close()
  }
}