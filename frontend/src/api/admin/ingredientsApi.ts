import axios from "axios"
import { Ingredient, IngredientResponse, CreateIngredientRequest } from "@interfaces/admin/IngredientTypes"

const API_URL = import.meta.env.VITE_API_URL

export const fetchIngredients = async (): Promise<Ingredient[]> => {
  const response = await axios.get<IngredientResponse[]>(`${API_URL}/ingredients`)

  return response.data.map(ingredient => ({
    ID: ingredient.id,
    name: ingredient.nombre,
    category: ingredient.categoria,
    price: ingredient.precio,
    quantity: ingredient.cantidad,
    expirationDate: ingredient.fechaCaducidad,
    type: ingredient.tipo
  }))
}

export const createIngredient = async (ingredient: CreateIngredientRequest): Promise<void> => {
  await axios.post(`${API_URL}/ingredients`, ingredient)
}