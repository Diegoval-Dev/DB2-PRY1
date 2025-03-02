import axios from "axios"
import { Inventory } from "@interfaces/admin/InventoryTypes"

const API_URL = import.meta.env.VITE_API_URL

interface InventoryApiResponse {
  ID: string
  ubicacion: string
  capacidad: number
  cantidadAlmacenada: number
}

export const fetchInventory = async (): Promise<Inventory[]> => {
  const response = await axios.get<InventoryApiResponse[]>(`${API_URL}/inventory`)
  return response.data.map((item) => ({
    ID: item.ID,
    location: item.ubicacion,
    capacity: item.capacidad,
    storedQuantity: item.cantidadAlmacenada
  }))
}

export const createInventory = async (inventory: Inventory): Promise<void> => {
  await axios.post(`${API_URL}/inventory`, {
    ID: inventory.ID,
    ubicacion: inventory.location,
    capacidad: inventory.capacity,
    cantidadAlmacenada: inventory.storedQuantity
  })
}
