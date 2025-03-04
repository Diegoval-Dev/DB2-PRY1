import axios from "axios";
import { Supplier, SupplierResponse, SupplierCreate, Supply } from "@interfaces/admin/SupplierTypes";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  const response = await axios.get<SupplierResponse[]>(`${API_URL}/suppliers`)
  return response.data.map((supplier) => ({
    ID: supplier.id,
    name: supplier.nombre,
    location: supplier.ubicación,
    rating: supplier.calificación,
    type: supplier.tipo
  }))
}


export const createSupplier = async (supplier: SupplierCreate): Promise<void> => {
  await axios.post(`${API_URL}/suppliers`, {
    id: supplier.id,
    nombre: supplier.nombre,
    ubicación: supplier.ubicación,
    calificación: supplier.calificación,
    tipo: supplier.tipo
  })
}

export const updateSupplierSupplies = async (id: string, supplies: Supply[]): Promise<void> => {
  await axios.put(`${API_URL}/suppliers/${id}/supplies`, { supplies })
}

export const updateSupplier = async (id: string, data: Partial<SupplierCreate>): Promise<void> => {
  await axios.patch(`${API_URL}/suppliers/${id}`, data)
}

export const deleteSupplier = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/suppliers/${id}`)
}

export const fetchSupplierSupplies = async (supplierId: string): Promise<Supply[]> => {
  const response = await axios.get<Supply[]>(`${API_URL}/suppliers/${supplierId}/supplies`)
  return response.data
}

export const deleteMultipleSuppliers = async (ids: string[]): Promise<void> => {
  await axios.post(`${API_URL}/suppliers/bulk-delete`, { ids })
}
