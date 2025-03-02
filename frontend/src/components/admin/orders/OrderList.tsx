import { useQuery } from "@tanstack/react-query"
import { fetchOrders } from "@api/admin/ordersApi"
import { Order } from "@interfaces/admin/OrderTypes"

const OrderList = () => {
  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  })

  if (isLoading) return <p>Cargando ordenes...</p>
  if (error) return <p>Error cargando ordenes.</p>

  return (
    <ul>
      {orders.map((order) => (
        <li key={order.ID}>
          {order.ID} - {order.orderDate} - Estado: {order.status} - Q{order.totalCost}
        </li>
      ))}
    </ul>
  )
}

export default OrderList
