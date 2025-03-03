import axios from "axios"
import { Order, OrderResponse } from "@interfaces/admin/OrderTypes"

const API_URL = import.meta.env.VITE_API_URL

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await axios.get<OrderResponse[]>(`${API_URL}/orders`)

  return response.data.map(order => ({
    ID: order.id,
    date: order.fecha,
    total: order.total,
    quantity: order.cantidad,
    status: order.estado,
    type: order.tipo
  }))
}
