import { Order } from "@interfaces/admin/OrderTypes"
import styles from './OrderList.module.css'
interface Props {
  orders: Order[]
  isLoading: boolean
  error: unknown
}

const OrderList = ({ orders, isLoading, error }: Props) => {
  if (isLoading) return <p>Cargando ordenes...</p>
  if (error) return <p>Error cargando ordenes.</p>

  return (
    <ul className={styles.orderList}>
        {orders.map(order => (
            <li className={styles.orderItem} key={order.ID}>
                <span className={styles.orderInfo}>
                    {order.date} - Q{order.total} ({order.quantity} productos) - Estado: {order.status} - Tipos: {order.type.join(", ")}
                </span>
            </li>
        ))}
    </ul>
)
}

export default OrderList
