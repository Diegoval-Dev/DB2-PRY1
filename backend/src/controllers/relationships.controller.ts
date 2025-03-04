import { Request, Response } from "express";
import { driver } from "../config/db";

// Relación SUPPLIES
export const createSuppliesRelation = async (req: Request, res: Response) => {
    const session = driver.session();
    const { supplierId, ingredientId, cantidad, fecha } = req.body;

    try {
        const query = `
            MATCH (s:Supplier {id: $supplierId})
            MATCH (i:Ingredient {id: $ingredientId})
            CREATE (s)-[:SUPPLIES {cantidad: toInteger($cantidad), fecha: date($fecha)}]->(i)
        `;
        await session.run(query, { supplierId, ingredientId, cantidad, fecha });
        res.json({ message: "Relación SUPPLIES creada" });
    } catch (error) {
        console.error("Error creando relación SUPPLIES:", error);
        res.status(500).json({ error: "Error creando relación SUPPLIES" });
    } finally {
        await session.close();
    }
};

// Relación STORED_IN
export const createStoredInRelation = async (req: Request, res: Response) => {
    const session = driver.session();
    const { ingredientId, inventoryId, cantidad } = req.body;

    try {
        const query = `
            MATCH (i:Ingredient {id: $ingredientId})
            MATCH (inv:Inventory {id: $inventoryId})
            CREATE (i)-[:STORED_IN {cantidad: toInteger($cantidad)}]->(inv)
        `;
        await session.run(query, { ingredientId, inventoryId, cantidad });
        res.json({ message: "Relación STORED_IN creada" });
    } catch (error) {
        console.error("Error creando relación STORED_IN:", error);
        res.status(500).json({ error: "Error creando relación STORED_IN" });
    } finally {
        await session.close();
    }
};

// Relación LOCATED_IN
export const createLocatedInRelation = async (req: Request, res: Response) => {
    const session = driver.session();
    const { inventoryId, locationId, ciudad } = req.body;

    try {
        const query = `
            MATCH (inv:Inventory {id: $inventoryId})
            MATCH (l:Location {id: $locationId})
            CREATE (inv)-[:LOCATED_IN {ciudad: $ciudad}]->(l)
        `;
        await session.run(query, { inventoryId, locationId, ciudad });
        res.json({ message: "Relación LOCATED_IN creada" });
    } catch (error) {
        console.error("Error creando relación LOCATED_IN:", error);
        res.status(500).json({ error: "Error creando relación LOCATED_IN" });
    } finally {
        await session.close();
    }
};

// Relación CONNECTS (ya manejada dentro de createRoute, opcionalmente puedes separar)
export const createConnectsRelation = async (req: Request, res: Response) => {
    const session = driver.session();
    const { routeId, origenId, destinoId, distancia, tipo } = req.body;

    try {
        const query = `
            MATCH (o:Location {id: $origenId})
            MATCH (d:Location {id: $destinoId})
            MATCH (r:Route {id: $routeId})
            CREATE (r)-[:CONNECTS {distancia: toFloat($distancia), tipo: $tipo}]->(o)
            CREATE (r)-[:CONNECTS {distancia: toFloat($distancia), tipo: $tipo}]->(d)
        `;
        await session.run(query, { routeId, origenId, destinoId, distancia, tipo });
        res.json({ message: "Relación CONNECTS creada" });
    } catch (error) {
        console.error("Error creando relación CONNECTS:", error);
        res.status(500).json({ error: "Error creando relación CONNECTS" });
    } finally {
        await session.close();
    }
};

// Relación BELONGS_TO
export const createBelongsToRelation = async (req: Request, res: Response) => {
    const session = driver.session();
    const { ingredientId, categoryId, categoria } = req.body;

    try {
        const query = `
            MATCH (i:Ingredient {id: $ingredientId})
            MATCH (c:Category {id: $categoryId})
            CREATE (i)-[:BELONGS_TO {categoria: $categoria}]->(c)
        `;
        await session.run(query, { ingredientId, categoryId, categoria });
        res.json({ message: "Relación BELONGS_TO creada" });
    } catch (error) {
        console.error("Error creando relación BELONGS_TO:", error);
        res.status(500).json({ error: "Error creando relación BELONGS_TO" });
    } finally {
        await session.close();
    }
};

// Relación PARTNERS_WITH
export const createPartnersWithRelation = async (req: Request, res: Response) => {
    const session = driver.session();
    const { supplier1Id, supplier2Id, desde } = req.body;

    try {
        const query = `
            MATCH (s1:Supplier {id: $supplier1Id})
            MATCH (s2:Supplier {id: $supplier2Id})
            CREATE (s1)-[:PARTNERS_WITH {desde: date($desde)}]->(s2)
        `;
        await session.run(query, { supplier1Id, supplier2Id, desde });
        res.json({ message: "Relación PARTNERS_WITH creada" });
    } catch (error) {
        console.error("Error creando relación PARTNERS_WITH:", error);
        res.status(500).json({ error: "Error creando relación PARTNERS_WITH" });
    } finally {
        await session.close();
    }
};
