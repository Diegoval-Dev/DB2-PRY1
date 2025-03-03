export type OrderType = "Order" | "Urgent" | "Recurrent"

export type OrderStatus = "pendiente" | "completada" | "cancelada"

export interface Order {
  ID: string
  date: string
  total: number
  quantity: number
  status: OrderStatus
  type: OrderType[]
}

// Este es el tipo que devuelve el backend, en español
export interface OrderResponse {
  id: string
  fecha: string
  total: number
  cantidad: number
  estado: OrderStatus
  tipo: OrderType[]
}
