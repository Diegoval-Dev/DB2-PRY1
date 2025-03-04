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

export const updateRoute = async (req: Request, res: Response) => {
  const { id } = req.params
  const { distancia, tipoTransporte, origen, destino } = req.body

  const session = driver.session()

  try {
      // Actualizar propiedades básicas de la ruta
      const query = `
          MATCH (r:Route {id: $id})
          SET ${distancia !== undefined ? "r.distancia = toFloat($distancia)," : ""}
              ${tipoTransporte !== undefined ? "r.tipoTransporte = $tipoTransporte," : ""}
              r._lastUpdated = datetime()
      `
      const cleanedQuery = query.replace(/,\s*$/g, "")

      await session.run(cleanedQuery, {
          id,
          distancia,
          tipoTransporte
      })

      if (origen && destino) {
          await session.run(`
              MATCH (r:Route {id: $id})-[c:CONNECTS]->()
              DELETE c
          `, { id })

          await session.run(`
              MATCH (r:Route {id: $id})
              MATCH (orig:Location {id: $origen})
              MATCH (dest:Location {id: $destino})
              MERGE (r)-[:CONNECTS {distancia: toFloat($distancia), tipo: $tipoTransporte}]->(orig)
              MERGE (r)-[:CONNECTS {distancia: toFloat($distancia), tipo: $tipoTransporte}]->(dest)
          `, { id, origen, destino, distancia, tipoTransporte })
      }

      res.json({ message: "Ruta actualizada correctamente" })
  } catch (error) {
      console.error("Error actualizando ruta:", error)
      res.status(500).json({ error: "Error actualizando ruta" })
  } finally {
      await session.close()
  }
}

export const deleteRoute = async (req: Request, res: Response) => {
  const { id } = req.params
  const session = driver.session()

  try {
      const query = `
          MATCH (r:Route {id: $id})
          DETACH DELETE r
      `

      const result = await session.run(query, { id })

      if (result.summary.counters.updates().nodesDeleted === 0) {
          res.status(404).json({ error: "Ruta no encontrada" })
          return
      }

      res.json({ message: "Ruta eliminada correctamente" })
  } catch (error) {
      console.error("Error eliminando ruta:", error)
      res.status(500).json({ error: "Error eliminando ruta" })
  } finally {
      await session.close()
  }
}