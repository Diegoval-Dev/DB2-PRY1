export type IngredientType = "Ingredient" | "Perishable" | "Organic"

export interface Ingredient {
  ID: string
  name: string
  category: string
  price: number
  quantity: number
  expirationDate: string
  type: IngredientType[]
}

// El que devuelve el 
export interface IngredientResponse {
  id: string
  nombre: string
  categoria: string
  precio: number
  cantidad: number
  fechaCaducidad: string
  tipo: IngredientType[]
}

export interface CreateIngredientRequest {
  id: string
  nombre: string
  categoría: string
  precio: number
  cantidad: number
  fechaCaducidad: string
  tipo: string[] // Las etiquetas (labels) como array de strings ["Ingredient", "Perishable", "Organic"]
}
