import axios from "axios";
import { Supplier, SupplierResponse } from "@interfaces/admin/SupplierTypes";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  const response = await axios.get<SupplierResponse[]>(`${API_URL}/suppliers`);
  
  return response.data.map((supplier): Supplier => ({
    ID: supplier.id,
    name: supplier.nombre,
    location: supplier.ubicación,
    rating: supplier.calificación,
  }));
};

export const createSupplier = async (supplier: Supplier): Promise<void> => {
  await axios.post(`${API_URL}/suppliers`, {
    ID: supplier.ID,
    nombre: supplier.name,
    ubicacion: supplier.location,
    calificacion: supplier.rating
  })
}
