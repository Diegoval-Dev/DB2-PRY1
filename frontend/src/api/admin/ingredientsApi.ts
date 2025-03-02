import axios from "axios"
import { Ingredient, IngredientResonse } from "@interfaces/admin/IngredientTypes"

const API_URL = import.meta.env.VITE_API_URL

export const fetchIngredients = async (): Promise<Ingredient[]> => {
  const response = await axios.get<IngredientResonse[]>(`${API_URL}/ingredients`)
  return response.data.map((item: IngredientResonse) => ({
    ID: item.id,
    name: item.nombre,
    category: item.categoría,
    price: item.precio,
    quantity: item.cantidad_en_existencia,
    expirationDate: item.fecha_caducidad
  }))
}

// POST create ingredient
export const createIngredient = async (ingredient: Ingredient): Promise<void> => {
  await axios.post(`${API_URL}/ingredients`, {
    ID: ingredient.ID,
    nombre: ingredient.name,
    categoria: ingredient.category,
    precio: ingredient.price,
    cantidad: ingredient.quantity,
    fechaCaducidad: ingredient.expirationDate
  })
}
