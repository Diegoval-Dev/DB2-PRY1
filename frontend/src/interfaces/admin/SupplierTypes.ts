export type SupplierType = "Supplier" | "Distributor" | "Wholesaler"

export interface Supplier {
  ID: string
  name: string
  location: string
  rating: number
  type: SupplierType[]
}

export interface SupplierResponse {
  id: string;
  ubicación: string;
  nombre: string;
  calificación: number;
  tipo: SupplierType[];
}

