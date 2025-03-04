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