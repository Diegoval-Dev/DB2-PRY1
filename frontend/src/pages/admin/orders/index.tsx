import OrderList from "@components/admin/orders/OrderList"
import { useQuery } from "@tanstack/react-query"
import { fetchOrders } from "@api/admin/ordersApi"
import { Order } from "@interfaces/admin/OrderTypes"

const OrdersPage = () => {
  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchOrders
  })
  return (
    <div>
      <h1>Gestion de Ordenes</h1>
      <OrderList orders={orders} isLoading={isLoading} error={error} />
    </div>
  )
}

export default OrdersPage
