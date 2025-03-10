import { NextFunction, Request, Response } from "express";
import { driver } from "../config/db";
import { parse } from "csv-parse/sync"
import fs from "fs"
import path from "path"


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
  const { id } = req.params
  const { nombre, categoría, precio, cantidad, fechaCaducidad } = req.body

  const session = driver.session()

  try {
      const query = `
          MATCH (i:Ingredient {id: $id})
          SET ${nombre !== undefined ? "i.nombre = $nombre," : ""}
              ${categoría !== undefined ? "i.categoría = $categoría," : ""}
              ${precio !== undefined ? "i.precio = toFloat($precio)," : ""}
              ${cantidad !== undefined ? "i.cantidad_en_existencia = toInteger($cantidad)," : ""}
              ${fechaCaducidad !== undefined ? "i.fecha_caducidad = date($fechaCaducidad)," : ""}
              i._lastUpdated = datetime()
      `
      const cleanedQuery = query.replace(/,\s*$/g, "") // Quita la ultima coma en caso de que falte algo

      const result = await session.run(cleanedQuery, {
          id,
          nombre,
          categoría,
          precio,
          cantidad,
          fechaCaducidad
      })

      if (result.summary.counters.updates().propertiesSet === 0) {
          res.status(404).json({ error: "Insumo no encontrado o sin cambios aplicados" })
          return
      }

      res.json({ message: "Insumo actualizado correctamente" })
  } catch (error) {
      console.error("Error actualizando ingrediente:", error)
      res.status(500).json({ error: "Error actualizando ingrediente" })
  } finally {
      await session.close()
  }
}

export const deleteIngredient = async (req: Request, res: Response) => {
  const { id } = req.params
  const session = driver.session()

  try {
      const query = `
          MATCH (i:Ingredient {id: $id})
          DETACH DELETE i
      `

      const result = await session.run(query, { id })

      if (result.summary.counters.updates().nodesDeleted === 0) {
          res.status(404).json({ error: "Insumo no encontrado" })
          return
      }

      res.json({ message: "Insumo eliminado correctamente" })
  } catch (error) {
      console.error("Error eliminando ingrediente:", error)
      res.status(500).json({ error: "Error eliminando ingrediente" })
  } finally {
      await session.close()
  }
}

export const bulkLoadIngredients = async (req: Request, res: Response) => {
  const session = driver.session()

  if (!req.file) {
      res.status(400).json({ error: "No se recibió archivo CSV" })
      return
  }

  const filePath = path.resolve(req.file.path)

  try {
      const csvData = fs.readFileSync(filePath, "utf-8") // ✅ Leemos el archivo físico

      const records = parse(csvData, { columns: true, skip_empty_lines: true })

      for (const record of records) {
          const {
              id,
              nombre,
              categoria,
              precio,
              fechaCaducidad,
              tipo,
              categoryId,
              inventoryId,
              cantidad
          } = record

          const tipos: string = tipo.split(",").map((t: string) => `\`${t.trim()}\``).join(":")

          await session.run(`
              MERGE (i:${tipos} {id: $id})
              ON CREATE SET 
                  i.nombre = $nombre,
                  i.categoría = $categoria,
                  i.precio = toFloat($precio),
                  i.fecha_caducidad = date($fechaCaducidad)
          `, { id, nombre, categoria, precio, fechaCaducidad })

          await session.run(`
              MATCH (i:Ingredient {id: $id})
              MATCH (c:Category {id: $categoryId})
              MERGE (i)-[:BELONGS_TO {categoria: c.nombre}]->(c)
          `, { id, categoryId })

          await session.run(`
              MATCH (i:Ingredient {id: $id})
              MATCH (inv:Inventory {id: $inventoryId})
              MERGE (i)-[r:STORED_IN]->(inv)
              ON CREATE SET r.cantidad = toInteger($cantidad)
              ON MATCH SET r.cantidad = toInteger($cantidad)
          `, { id, inventoryId, cantidad })
      }

      fs.unlinkSync(filePath)

      res.json({ message: "Ingredientes cargados correctamente desde CSV" })
  } catch (error) {
      console.error("Error procesando archivo CSV:", error)
      res.status(500).json({ error: "Error procesando archivo CSV" })
  } finally {
      await session.close()
  }
}
