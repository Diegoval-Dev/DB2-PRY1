import axios from "axios"
import { Inventory, InventoryResponse, CreateInventoryRequest } from "@interfaces/admin/InventoryTypes"

const API_URL = import.meta.env.VITE_API_URL

export const fetchInventories = async (): Promise<Inventory[]> => {
  const response = await axios.get<InventoryResponse[]>(`${API_URL}/inventory`)

  return response.data.map(inventory => ({
    ID: inventory.id,
    location: inventory.ubicacion,
    capacity: inventory.capacidad,
    supplyQuantity: inventory.cantidadInsumo,
    storedQuantity: inventory.capacidad, 
    type: inventory.tipo
  }))
}

export const createInventory = async (inventory: Inventory): Promise<void> => {
  await axios.post(`${API_URL}/inventory`, {
      id: inventory.ID,
      capacidad: inventory.capacity,
      cantidadInsumo: inventory.supplyQuantity,
      tipo: inventory.type,
      ubicacion: inventory.location
  })
}

export const updateInventory = async (id: string, data: Partial<CreateInventoryRequest>): Promise<void> => {
  await axios.patch(`${API_URL}/inventory/${id}`, data)
}

export const deleteInventory = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/inventory/${id}`)
}

