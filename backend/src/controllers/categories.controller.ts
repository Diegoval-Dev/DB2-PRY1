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

export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params
    const { nombre, descripcion } = req.body

    const session = driver.session()

    try {
        const query = `
            MATCH (c:Category {id: $id})
            SET ${nombre !== undefined ? "c.nombre = $nombre," : ""}
                ${descripcion !== undefined ? "c.descripcion = $descripcion," : ""}
                c._lastUpdated = datetime()
        `
        const cleanedQuery = query.replace(/,\s*$/g, "")

        const result = await session.run(cleanedQuery, {
            id,
            nombre,
            descripcion
        })

        if (result.summary.counters.updates().propertiesSet === 0) {
            res.status(404).json({ error: "Categoria no encontrada o sin cambios aplicados" })
            return
        }

        res.json({ message: "Categoria actualizada correctamente" })
    } catch (error) {
        console.error("Error actualizando categoria:", error)
        res.status(500).json({ error: "Error actualizando categoria" })
    } finally {
        await session.close()
    }
}

// Eliminar categoría
export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params
    const session = driver.session()

    try {
        const query = `
            MATCH (c:Category {id: $id})
            DETACH DELETE c
        `

        const result = await session.run(query, { id })

        if (result.summary.counters.updates().nodesDeleted === 0) {
            res.status(404).json({ error: "Categoria no encontrada" })
            return
        }

        res.json({ message: "Categoria eliminada correctamente" })
    } catch (error) {
        console.error("Error eliminando categoria:", error)
        res.status(500).json({ error: "Error eliminando categoria" })
    } finally {
        await session.close()
    }
}
