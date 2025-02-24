import { NextFunction, Request, Response } from "express";
import { driver } from "../config/db";

export const getAllIngredients = async (req: Request, res: Response) => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (i:Ingredient) RETURN i`);
    const ingredients = result.records.map(record => record.get("i").properties);
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo ingredientes" });
  } finally {
    await session.close();
  }
};


export const getIngredientById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (i:Ingredient {ID: $id}) RETURN i`, { id: req.params.id });

    if (result.records.length === 0) {
      return next(new Error("Insumo no encontrado"));
    }

    res.json(result.records[0].get("i").properties);
  } catch (error) {
    next(error); // Pasar error al siguiente middleware
  } finally {
    await session.close();
  }
};


export const createIngredient = async (req: Request, res: Response) => {
  const session = driver.session();
  const { ID, nombre, categoría, precio, cantidad, fechaCaducidad } = req.body;
  try {
    await session.run(
      `CREATE (:Ingredient {ID: $ID, nombre: $nombre, categoría: $categoría, precio: $precio, cantidad: $cantidad, fechaCaducidad: date($fechaCaducidad)})`,
      { ID, nombre, categoría, precio, cantidad, fechaCaducidad }
    );
    res.json({ message: "Insumo creado" });
  } catch (error) {
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
