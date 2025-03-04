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
    fechaCaducidad: string
    tipo: string[]
    categoryId: string
    storages: StorageRequest[] // ✅ Nuevo y correcto
}

export interface StorageRequest {
    inventoryId: string,
    cantidad: number
}
