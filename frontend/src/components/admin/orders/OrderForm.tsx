import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createOrder } from "@api/admin/ordersApi"
import { Order } from "@interfaces/admin/OrderTypes"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { orderSchema } from "@validations/admin/orderSchema"

const OrderForm = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      reset()
    },
    onError: () => {
      alert("Error al crear orden")
    }
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Order>({
    resolver: yupResolver(orderSchema),
    defaultValues: {
      ID: "",
      orderDate: "",
      quantity: 0,
      status: "pendiente",
      totalCost: 0
    }
  })

  const onSubmit = (data: Order) => {
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="ID" {...register("ID")} />
      <p>{errors.ID?.message}</p>

      <input type="date" placeholder="Fecha de orden" {...register("orderDate")} />
      <p>{errors.orderDate?.message}</p>

      <input type="number" placeholder="Cantidad" {...register("quantity")} />
      <p>{errors.quantity?.message}</p>

      <select {...register("status")}>
        <option value="pendiente">Pendiente</option>
        <option value="enviada">Enviada</option>
        <option value="completada">Completada</option>
      </select>
      <p>{errors.status?.message}</p>

      <input type="number" placeholder="Costo total" {...register("totalCost")} />
      <p>{errors.totalCost?.message}</p>

      <button type="submit" disabled={mutation.isPending}>Guardar Orden</button>
    </form>
  )
}

export default OrderForm
