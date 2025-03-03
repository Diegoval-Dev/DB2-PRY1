export type InventoryType = "Inventory" | "ColdStorage" | "DryStorage"

export interface Inventory {
  ID: string
  location: string
  capacity: number
  supplyQuantity: number
  storedQuantity: number
  type: InventoryType[]
}
export interface InventoryResponse {
  id: string
  capacidad: number
  ubicacion: string
  cantidadInsumo: number
  tipo: InventoryType[]
}
