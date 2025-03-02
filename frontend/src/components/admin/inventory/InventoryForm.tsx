import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createInventory } from "@api/admin/inventoryApi"
import { Inventory } from "@interfaces/admin/InventoryTypes"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { inventorySchema } from "@validations/admin/inventorySchema"

const InventoryForm = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
      reset()
    },
    onError: () => {
      alert("Error al crear inventario")
    }
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Inventory>({
    resolver: yupResolver(inventorySchema),
    defaultValues: {
      ID: "",
      location: "",
      capacity: 0,
      storedQuantity: 0
    }
  })

  const onSubmit = (data: Inventory) => {
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="ID" {...register("ID")} />
      <p>{errors.ID?.message}</p>

      <input type="text" placeholder="Ubicacion" {...register("location")} />
      <p>{errors.location?.message}</p>

      <input type="number" placeholder="Capacidad" {...register("capacity")} />
      <p>{errors.capacity?.message}</p>

      <input type="number" placeholder="Cantidad almacenada" {...register("storedQuantity")} />
      <p>{errors.storedQuantity?.message}</p>

      <button type="submit" disabled={mutation.isPending}>Guardar Inventario</button>
    </form>
  )
}

export default InventoryForm
