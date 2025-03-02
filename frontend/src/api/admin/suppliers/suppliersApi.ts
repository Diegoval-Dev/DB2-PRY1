import axios from "axios";
import { Supplier } from "@interfaces/admin/SupplierTypes";



const API_URL = import.meta.env.VITE_API_URL;


interface SupplierResponse {
  ID: string;
  nombre: string;
  ubicacion: string;
  calificacion: number;
}

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  const response = await axios.get<SupplierResponse[]>(`${API_URL}/suppliers`);
  
  return response.data.map((supplier): Supplier => ({
    ID: supplier.ID,
    name: supplier.nombre,
    location: supplier.ubicacion,
    rating: supplier.calificacion,
  }));
};
