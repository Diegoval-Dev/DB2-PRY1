export type SupplierType = "Supplier" | "Distributor" | "Wholesaler"

export interface Supplier {
  ID: string
  name: string
  location: string
  rating: number
  type: SupplierType[]
}

export interface SupplierCreate {
  id: string
  nombre: string
  ubicación: string
  calificación: number
  tipo: SupplierType[]
}


export interface SupplierResponse {
  id: string;
  ubicación: string;
  nombre: string;
  calificación: number;
  tipo: SupplierType[];
}

