import { Request, Response } from "express";
import { driver } from "../config/db";

export const getAllRoutes = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (r:Route) RETURN r`);
    const routes = result.records.map(record => record.get("r").properties);
    res.json(routes);
  } catch (error) {
    console.error("Error obteniendo rutas:", error);
    res.status(500).json({ error: "Error obteniendo rutas" });
  } finally {
    await session.close();
  }
};

export const getRouteById = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (r:Route {ID: $id}) RETURN r`, { id: req.params.id });
    if (result.records.length === 0) {
      res.status(404).json({ error: "Ruta no encontrada" });
      return;
    }
    res.json(result.records[0].get("r").properties);
  } catch (error) {
    console.error("Error obteniendo ruta:", error);
    res.status(500).json({ error: "Error obteniendo ruta" });
  } finally {
    await session.close();
  }
};

export const createRoute = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  const { ID, origen, destino, distancia, tipo } = req.body;
  try {
    await session.run(
      `CREATE (:Route {ID: $ID, origen: $origen, destino: $destino, distancia: $distancia, tipo: $tipo})`,
      { ID, origen, destino, distancia, tipo }
    );
    res.json({ message: "Ruta creada" });
  } catch (error) {
    console.error("Error creando ruta:", error);
    res.status(500).json({ error: "Error creando ruta" });
  } finally {
    await session.close();
  }
};

export const updateRoute = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  const { origen, destino, distancia, tipo } = req.body;
  try {
    await session.run(
      `MATCH (r:Route {ID: $id}) 
       SET r.origen = $origen, r.destino = $destino, r.distancia = $distancia, r.tipo = $tipo 
       RETURN r`,
      { id: req.params.id, origen, destino, distancia, tipo }
    );
    res.json({ message: "Ruta actualizada" });
  } catch (error) {
    console.error("Error actualizando ruta:", error);
    res.status(500).json({ error: "Error actualizando ruta" });
  } finally {
    await session.close();
  }
};

export const deleteRoute = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();
  try {
    await session.run(`MATCH (r:Route {ID: $id}) DETACH DELETE r`, { id: req.params.id });
    res.json({ message: "Ruta eliminada" });
  } catch (error) {
    console.error("Error eliminando ruta:", error);
    res.status(500).json({ error: "Error eliminando ruta" });
  } finally {
    await session.close();
  }
};
