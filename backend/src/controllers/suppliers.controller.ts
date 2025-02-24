import { Request, Response } from "express";
import { driver } from "../config/db";

export const getAllSuppliers = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (s:Supplier) RETURN s`);
    const suppliers = result.records.map(record => record.get("s").properties);
    res.json(suppliers);
  } catch (error) {
    console.error("Error obteniendo proveedores:", error);
    res.status(500).json({ error: "Error obteniendo proveedores" });
  } finally {
    await session.close();
  }
};

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
  const { ID, nombre, ubicación, calificación } = req.body;
  try {
    await session.run(
      `CREATE (:Supplier {ID: $ID, nombre: $nombre, ubicación: $ubicación, calificación: $calificación})`,
      { ID, nombre, ubicación, calificación }
    );
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

export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  try {
    await session.run(`MATCH (s:Supplier {ID: $id}) DETACH DELETE s`, { id: req.params.id });
    res.json({ message: "Proveedor eliminado" });
  } catch (error) {
    console.error("Error eliminando proveedor:", error);
    res.status(500).json({ error: "Error eliminando proveedor" });
  } finally {
    await session.close();
  }
};
