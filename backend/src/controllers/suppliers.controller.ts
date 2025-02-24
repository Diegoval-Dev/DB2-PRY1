import { Request, Response } from "express";
import { driver } from "../config/db";

export const getAllSuppliers = async (req: Request, res: Response) => {
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
