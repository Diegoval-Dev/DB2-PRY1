import axios from "axios"
import { Order, OrderResponse } from "@interfaces/admin/OrderTypes"

const API_URL = import.meta.env.VITE_API_URL


export const fetchOrders = async (): Promise<Order[]> => {
  const response = await axios.get<OrderResponse[]>(`${API_URL}/orders`)

  return response.data.map((item) => ({
    ID: item.id,
    orderDate: item.fecha_orden,
    quantity: item.cantidad,
    status: item.estado,
    totalCost: item.costo_total
  }))
}

export const createOrder = async (order: Order): Promise<void> => {
  await axios.post(`${API_URL}/orders`, {
    ID: order.ID,
    fechaOrden: order.orderDate,
    cantidad: order.quantity,
    estado: order.status,
    costoTotal: order.totalCost
  })
}
