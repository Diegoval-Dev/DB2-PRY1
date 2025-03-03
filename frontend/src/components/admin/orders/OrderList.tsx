import { Order } from "@interfaces/admin/OrderTypes"

interface Props {
  orders: Order[]
  isLoading: boolean
  error: unknown
}

const OrderList = ({ orders, isLoading, error }: Props) => {
  if (isLoading) return <p>Cargando ordenes...</p>
  if (error) return <p>Error cargando ordenes.</p>

  return (
    <ul>
      {orders.map(order => (
        <li key={order.ID}>
          {order.date} - Q{order.total} ({order.quantity} productos) - Estado: {order.status} - Tipos: {order.type.join(", ")}
        </li>
      ))}
    </ul>
  )
}

export default OrderList
