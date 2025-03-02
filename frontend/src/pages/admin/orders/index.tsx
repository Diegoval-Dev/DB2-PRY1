import OrderList from "@components/admin/orders/OrderList"
import OrderForm from "@components/admin/orders/OrderForm"

const OrdersPage = () => {
  return (
    <div>
      <h1>Gestion de Ordenes</h1>
      <OrderForm />
      <OrderList />
    </div>
  )
}

export default OrdersPage
