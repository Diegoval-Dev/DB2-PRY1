import { Request, Response } from "express";
import { driver } from "../config/db";

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
