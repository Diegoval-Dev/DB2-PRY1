import axios from "axios";
import { Supplier, SupplierResponse, SupplierCreate } from "@interfaces/admin/SupplierTypes";

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
