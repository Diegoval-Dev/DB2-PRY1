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
        nombre: properties.nombre,
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
  const { ID, ubicación, capacidad, cantidadAlmacenada } = req.body;
  try {
    await session.run(
      `CREATE (:Inventory {ID: $ID, ubicación: $ubicación, capacidad: $capacidad, cantidadAlmacenada: $cantidadAlmacenada})`,
      { ID, ubicación, capacidad, cantidadAlmacenada }
    );
    res.json({ message: "Inventario creado" });
  } catch (error) {
    console.error("Error creando inventario:", error);
    res.status(500).json({ error: "Error creando inventario" });
  } finally {
    await session.close();
  }
};

export const updateInventory = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  const { ubicación, capacidad, cantidadAlmacenada } = req.body;
  try {
    await session.run(
      `MATCH (inv:Inventory {ID: $id}) 
       SET inv.ubicación = $ubicación, inv.capacidad = $capacidad, inv.cantidadAlmacenada = $cantidadAlmacenada 
       RETURN inv`,
      { id: req.params.id, ubicación, capacidad, cantidadAlmacenada }
    );
    res.json({ message: "Inventario actualizado" });
  } catch (error) {
    console.error("Error actualizando inventario:", error);
    res.status(500).json({ error: "Error actualizando inventario" });
  } finally {
    await session.close();
  }
};

export const deleteInventory = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  try {
    await session.run(`MATCH (inv:Inventory {ID: $id}) DETACH DELETE inv`, { id: req.params.id });
    res.json({ message: "Inventario eliminado" });
  } catch (error) {
    console.error("Error eliminando inventario:", error);
    res.status(500).json({ error: "Error eliminando inventario" });
  } finally {
    await session.close();
  }
};
