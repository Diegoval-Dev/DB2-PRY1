export interface Ingredient {
  ID: string
  name: string
  category: string
  price: number
  quantity: number
  expirationDate: string 
}

export interface IngredientResonse {
  id: string
  precio: number
  cantidad_en_existencia: number
  categoría: string
  nombre: string
  fecha_caducidad: string
}
