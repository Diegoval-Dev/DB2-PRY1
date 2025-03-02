import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createSupplier } from "@api/admin/suppliersApi"
import { Supplier } from "@interfaces/admin/SupplierTypes"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { supplierSchema } from "@validations/admin/supplierSchema"

const SupplierForm = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      reset()
    },
    onError: () => {
      alert("Error al crear proveedor")
    }
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Supplier>({
    resolver: yupResolver(supplierSchema),
    defaultValues: {
      ID: "",
      name: "",
      location: "",
      rating: 1
    }
  })

  const onSubmit = (data: Supplier) => {
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="ID" {...register("ID")} />
      <p>{errors.ID?.message}</p>

      <input type="text" placeholder="Nombre" {...register("name")} />
      <p>{errors.name?.message}</p>

      <input type="text" placeholder="Ubicacion" {...register("location")} />
      <p>{errors.location?.message}</p>

      <input type="number" placeholder="Calificacion (1-5)" {...register("rating")} />
      <p>{errors.rating?.message}</p>

      <button type="submit" disabled={mutation.isPending}>Guardar Proveedor</button>
    </form>
  )
}

export default SupplierForm
