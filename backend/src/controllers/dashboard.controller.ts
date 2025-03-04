import { Request, Response } from "express"
import { driver } from "../config/db"

export const getDashboardMetrics = async (req: Request, res: Response) => {
    const session = driver.session()

    try {
        const query = `
            CALL {
                MATCH (s:Supplier) RETURN count(s) AS totalSuppliers
            }
            CALL {
                MATCH (i:Ingredient) RETURN count(i) AS totalIngredients
            }
            CALL {
                MATCH (inv:Inventory) RETURN count(inv) AS totalInventories
            }
            CALL {
                MATCH (l:Location) RETURN count(l) AS totalLocations
            }
            CALL {
                MATCH (r:Route) RETURN count(r) AS totalRoutes
            }
            CALL {
                MATCH (c:Category) RETURN count(c) AS totalCategories
            }
            RETURN totalSuppliers, totalIngredients, totalInventories, totalLocations, totalRoutes, totalCategories
        `

        const result = await session.run(query)

        const record = result.records[0]
        const metrics = {
            totalSuppliers: record.get("totalSuppliers").toNumber(),
            totalIngredients: record.get("totalIngredients").toNumber(),
            totalInventories: record.get("totalInventories").toNumber(),
            totalLocations: record.get("totalLocations").toNumber(),
            totalRoutes: record.get("totalRoutes").toNumber(),
            totalCategories: record.get("totalCategories").toNumber()
        }

        res.json(metrics)
    } catch (error) {
        console.error("Error obteniendo métricas del dashboard:", error)
        res.status(500).json({ error: "Error obteniendo métricas del dashboard" })
    } finally {
        await session.close()
    }
}