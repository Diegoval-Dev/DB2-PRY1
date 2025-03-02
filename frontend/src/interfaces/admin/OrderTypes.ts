export interface Order {
  ID: string
  orderDate: string // ISO Date string
  quantity: number
  status: "pendiente" | "enviada" | "completada";
  totalCost: number
}

export interface OrderResponse {
  costo_total: number
  estado: "pendiente" | "enviada" | "completada"
  id: string
  cantidad: number
  fecha_orden: string
}
