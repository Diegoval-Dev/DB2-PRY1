import { Request, Response } from "express"
import { driver } from "../config/db"

// Crear categoría
export const createCategory = async (req: Request, res: Response) => {
    const session = driver.session()
    const { id, nombre } = req.body

    try {
        await session.run(
            `CREATE (c:Category {id: $id, nombre: $nombre})`,
            { id, nombre }
        )
        res.json({ message: "Categoría creada" })
    } catch (error) {
        console.error("Error creando categoría:", error)
        res.status(500).json({ error: "Error creando categoría" })
    } finally {
        await session.close()
    }
}

// Obtener todas las categorías
export const getAllCategories = async (req: Request, res: Response) => {
    const session = driver.session()

    try {
        const result = await session.run(`MATCH (c:Category) RETURN c`)
        const categories = result.records.map(record => {
            const props = record.get("c").properties
            return {
                id: props.id,
                nombre: props.nombre
            }
        })
        res.json(categories)
    } catch (error) {
        console.error("Error obteniendo categorías:", error)
        res.status(500).json({ error: "Error obteniendo categorías" })
    } finally {
        await session.close()
    }
}

// Eliminar categoría
export const deleteCategory = async (req: Request, res: Response) => {
    const session = driver.session()
    const { id } = req.params

    try {
        await session.run(
            `MATCH (c:Category {id: $id}) DETACH DELETE c`,
            { id }
        )
        res.json({ message: "Categoría eliminada" })
    } catch (error) {
        console.error("Error eliminando categoría:", error)
        res.status(500).json({ error: "Error eliminando categoría" })
    } finally {
        await session.close()
    }
}
