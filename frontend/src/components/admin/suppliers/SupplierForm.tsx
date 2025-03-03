import { useMutation } from "@tanstack/react-query"
import { createSupplier } from "@api/admin/suppliersApi"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { supplierSchema } from "@validations/admin/supplierSchema"
import { SupplierType } from "@interfaces/admin/SupplierTypes"

export interface SupplierFormData {
  ID: string
  name: string
  location: string
  rating: number
  type: (string | undefined)[]
}


interface Props {
  refetch: () => void
}

const SupplierForm = ({ refetch }: Props) => {
  const mutation = useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      refetch()
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
  } = useForm<SupplierFormData>({
    resolver: yupResolver(supplierSchema),
    defaultValues: {
      ID: "",
      name: "",
      location: "",
      rating: 1,
      type: []
    }
  })

  const onSubmit = (data: SupplierFormData) => {
    mutation.mutate({
        id: data.ID,
        nombre: data.name,
        ubicación: data.location,
        calificación: data.rating,
        tipo: data.type.filter((t): t is SupplierType => t === "Supplier" || t === "Distributor" || t === "Wholesaler")
    })
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

      <label>
        <input type="checkbox" value="Supplier" {...register("type")} /> Supplier
      </label>
      <label>
        <input type="checkbox" value="Distributor" {...register("type")} /> Distributor
      </label>
      <label>
        <input type="checkbox" value="Wholesaler" {...register("type")} /> Wholesaler
      </label>
      <p>{errors.type?.message}</p>

      <button type="submit" disabled={mutation.isPending}>Guardar Proveedor</button>
    </form>
  )
}

export default SupplierForm
