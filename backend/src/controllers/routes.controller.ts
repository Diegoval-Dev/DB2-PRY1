import { Request, Response } from "express";
import { driver } from "../config/db";

export const createRoute = async (req: Request, res: Response) => {
  const session = driver.session();
  const { id, origen, destino, distancia, tipoTransporte } = req.body;

  try {
      const query = `
          MATCH (o:Location {id: $origen})
          MATCH (d:Location {id: $destino})
          CREATE (r:Route {id: $id, distancia: toFloat($distancia), tipoTransporte: $tipoTransporte})
          CREATE (r)-[:CONNECTS]->(o)
          CREATE (r)-[:CONNECTS]->(d)
      `;
      await session.run(query, { id, origen, destino, distancia, tipoTransporte });
      res.json({ message: "Ruta creada correctamente" });
  } catch (error) {
      console.error("Error creando ruta:", error);
      res.status(500).json({ error: "Error creando ruta" });
  } finally {
      await session.close();
  }
};

export const getAllRoutes = async (req: Request, res: Response) => {
  const session = driver.session();
  try {
      const query = `
          MATCH (r:Route)-[:CONNECTS]->(o:Location), (r)-[:CONNECTS]->(d:Location)
          RETURN r.id AS id, o.nombre AS origen, d.nombre AS destino, r.distancia AS distancia, r.tipoTransporte AS tipoTransporte
      `;
      const result = await session.run(query);
      const routes = result.records.map(record => ({
          id: record.get("id"),
          origen: record.get("origen"),
          destino: record.get("destino"),
          distancia: record.get("distancia"),
          tipoTransporte: record.get("tipoTransporte")
      }));

      res.json(routes);
  } catch (error) {
      console.error("Error obteniendo rutas:", error);
      res.status(500).json({ error: "Error obteniendo rutas" });
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
