import { NextFunction, Request, Response } from "express";
import { driver } from "../config/db";

export const getAllRestaurants = async (req: Request, res: Response): Promise<void> => {
    const session = driver.session();
    try {
        const result = await session.run('MATCH (r:Location:Restaurant) RETURN r');

        const restaurants = result.records.map(record => {
            const node = record.get('r');
            return {
                id: node.properties.ID,
                nombre: node.properties.nombre,
                tipo: node.properties.tipo
            };
        });

        res.json(restaurants);
    } catch (error) {
        console.error('Error al obtener restaurantes:', error);
        res.status(500).json({ error: 'Error al obtener restaurantes' });
    } finally {
        await session.close();
    }
};


export const getAllLocations = async (req: Request, res: Response): Promise<void> => {
  const session = driver.session();

  const query = `
      MATCH (l:Location)
      RETURN l.id AS id, l.nombre AS nombre, labels(l) AS tipoUbicacion
  `;

  try {
      const result = await session.run(query);
      const locations = result.records.map(record => ({
          id: record.get("id"),
          nombre: record.get("nombre"),
          tipoUbicacion: record.get("tipoUbicacion")
      }));

      res.json(locations);
  } catch (error) {
      console.error("Error obteniendo ubicaciones:", error);
      res.status(500).json({ error: "Error obteniendo ubicaciones" });
  } finally {
      await session.close();
  }
};

export const createLocation = async (req: Request, res: Response): Promise<void> => {
    const session = driver.session();

    const { id, nombre, tipoUbicacion } = req.body;

    console.log("Datos recibidos:", req.body);

    if (!Array.isArray(tipoUbicacion) || tipoUbicacion.length === 0) {
        res.status(400).json({ error: "Debe especificar al menos un tipo de ubicación" });
        return;
    }

    const labels = tipoUbicacion.map(t => `\`${t}\``).join(":");

    const query = `
        CREATE (l:${labels} {id: $id, nombre: $nombre})
    `;

    console.log("Query generado:", query);
    console.log("Parametros a insertar:", { id, nombre });

    try {
        await session.run(query, { id, nombre });
        res.json({ message: "Ubicación creada exitosamente" });
    } catch (error) {
        console.error("Error creando ubicación:", error);
        res.status(500).json({ error: "Error creando ubicación" });
    } finally {
        await session.close();
    }
};

export const updateLocation = async (req: Request, res: Response) => {
    const { id } = req.params
    const { nombre, tipoUbicacion } = req.body

    const session = driver.session()

    try {
        const query = `
            MATCH (loc:Location {id: $id})
            SET ${nombre !== undefined ? "loc.nombre = $nombre," : ""}
                ${tipoUbicacion !== undefined ? "loc.tipoUbicacion = $tipoUbicacion," : ""}
                loc._lastUpdated = datetime()
        `
        const cleanedQuery = query.replace(/,\s*$/g, "")

        const result = await session.run(cleanedQuery, {
            id,
            nombre,
            tipoUbicacion
        })

        if (result.summary.counters.updates().propertiesSet === 0) {
            res.status(404).json({ error: "Ubicacion no encontrada o sin cambios aplicados" })
            return
        }

        res.json({ message: "Ubicacion actualizada correctamente" })
    } catch (error) {
        console.error("Error actualizando ubicacion:", error)
        res.status(500).json({ error: "Error actualizando ubicacion" })
    } finally {
        await session.close()
    }
}

export const deleteLocation = async (req: Request, res: Response) => {
    const { id } = req.params
    const session = driver.session()

    try {
        const query = `
            MATCH (loc:Location {id: $id})
            DETACH DELETE loc
        `

        const result = await session.run(query, { id })

        if (result.summary.counters.updates().nodesDeleted === 0) {
            res.status(404).json({ error: "Ubicacion no encontrada" })
            return
        }

        res.json({ message: "Ubicacion eliminada correctamente" })
    } catch (error) {
        console.error("Error eliminando ubicacion:", error)
        res.status(500).json({ error: "Error eliminando ubicacion" })
    } finally {
        await session.close()
    }
}
