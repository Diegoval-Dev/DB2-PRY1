import { NextFunction, Request, Response } from "express";
import { driver } from "../config/db";

export const getAllIngredients = async (req: Request, res: Response) => {
  const session = driver.session()

  try {
    const result = await session.run(`
      MATCH (i)
      WHERE i:Ingredient OR i:Perishable OR i:Organic
      RETURN i, labels(i) AS labels
    `)

    const ingredients = result.records.map(record => {
      const properties = record.get("i").properties
      const labels = record.get("labels")

      const tipo: string[] = labels.filter((label: string) => ["Ingredient", "Perishable", "Organic"].includes(label))

      return {
        id: properties.id,
        nombre: properties.nombre,
        categoria: properties.categoría,
        precio: properties.precio,
        cantidad: properties.cantidad_en_existencia,
        fechaCaducidad: properties.fecha_caducidad,
        tipo
      }
    })

    res.json(ingredients)
  } catch (error) {
    console.error("Error obteniendo ingredientes:", error)
    res.status(500).json({ error: "Error obteniendo ingredientes" })
  } finally {
    await session.close()
  }
}
export const getIngredientById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (i:Ingredient {ID: $id}) RETURN i`, { id: req.params.id });

    if (result.records.length === 0) {
      return next(new Error("Insumo no encontrado"));
    }

    res.json(result.records[0].get("i").properties);
  } catch (error) {
    next(error); 
  } finally {
    await session.close();
  }
};

export const createIngredient = async (req: Request, res: Response) => {
  const session = driver.session();
  const { id, nombre, categoría, precio, fechaCaducidad, tipo, categoryId, storages } = req.body;

  if (!Array.isArray(tipo) || tipo.length === 0) {
      res.status(400).json({ error: "Debe especificar al menos un tipo" });
      return;
  }

  if (!categoryId) {
      res.status(400).json({ error: "Debe especificar el categoryId" });
      return;
  }

  if (!Array.isArray(storages) || storages.length === 0) {
      res.status(400).json({ error: "Debe especificar al menos un inventario con cantidad" });
      return;
  }

  const labels = tipo.map(t => `\`${t}\``).join(":");

  const createIngredientQuery = `
      CREATE (i:${labels} {
          id: $id,
          nombre: $nombre,
          categoría: $categoría,
          precio: toFloat($precio),
          fecha_caducidad: date($fechaCaducidad)
      })
  `;

  try {
      await session.run(createIngredientQuery, { id, nombre, categoría, precio, fechaCaducidad });

      
      const categoryCheck = await session.run(
          `MATCH (c:Category {id: $categoryId}) RETURN c`,
          { categoryId }
      );

      if (categoryCheck.records.length === 0) {
          res.status(400).json({ error: "El categoryId proporcionado no existe" });
          return;
      }

      
      await session.run(
          `
          MATCH (i:Ingredient {id: $id})
          MATCH (c:Category {id: $categoryId})
          CREATE (i)-[:BELONGS_TO {categoria: c.nombre}]->(c)
          `,
          { id, categoryId }
      );

      
      for (const storage of storages) {
          const { inventoryId, cantidad } = storage;

          
          const inventoryCheck = await session.run(
              `MATCH (inv:Inventory {id: $inventoryId}) RETURN inv`,
              { inventoryId }
          );

          if (inventoryCheck.records.length === 0) {
              res.status(400).json({ error: `El inventoryId ${inventoryId} no existe` });
              return;
          }

          await session.run(
              `
              MATCH (i:Ingredient {id: $id})
              MATCH (inv:Inventory {id: $inventoryId})
              CREATE (i)-[:STORED_IN {cantidad: toInteger($cantidad)}]->(inv)
              `,
              { id, inventoryId, cantidad }
          );
      }

      res.json({ message: "Insumo creado y relacionado correctamente con categoría e inventarios" });
  } catch (error) {
      console.error("Error creando insumo:", error);
      res.status(500).json({ error: "Error creando insumo" });
  } finally {
      await session.close();
  }
};

export const updateIngredient = async (req: Request, res: Response) => {
  const session = driver.session();
  const { nombre, categoría, precio, cantidad, fechaCaducidad } = req.body;
  try {
    await session.run(
      `MATCH (i:Ingredient {ID: $id}) SET i.nombre = $nombre, i.categoría = $categoría, i.precio = $precio, i.cantidad = $cantidad, i.fechaCaducidad = date($fechaCaducidad) RETURN i`,
      { id: req.params.id, nombre, categoría, precio, cantidad, fechaCaducidad }
    );
    res.json({ message: "Insumo actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando insumo" });
  } finally {
    await session.close();
  }
};

export const deleteIngredient = async (req: Request, res: Response) => {
  const session = driver.session();
  try {
    await session.run(`MATCH (i:Ingredient {ID: $id}) DETACH DELETE i`, { id: req.params.id });
    res.json({ message: "Insumo eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando insumo" });
  } finally {
    await session.close();
  }
};
