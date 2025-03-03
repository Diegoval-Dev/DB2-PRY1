import { useMutation } from "@tanstack/react-query"
import { createIngredient } from "@api/admin/ingredientsApi"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ingredientSchema } from "@validations/admin/ingredientSchema"
import { CreateIngredientRequest } from "@interfaces/admin/IngredientTypes"

interface Props {
  refetch: () => void
}

interface IngredientFormData {
  ID: string
  name: string
  category: string
  price: number
  quantity: number
  expirationDate: string
  type: (string | undefined)[]
}

const IngredientForm = ({ refetch }: Props) => {
  const mutation = useMutation({
    mutationFn: createIngredient,
    onSuccess: () => {
      refetch()
      reset()
    },
    onError: () => {
      alert("Error al crear insumo")
    }
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IngredientFormData>({
    resolver: yupResolver(ingredientSchema),
    defaultValues: {
      ID: "",
      name: "",
      category: "",
      price: 0,
      quantity: 0,
      expirationDate: "",
      type: []
    }
  })

  const onSubmit = (data: IngredientFormData) => {
    const adapted: CreateIngredientRequest = {
        id: data.ID,
        nombre: data.name,
        categoría: data.category,
        precio: data.price,
        cantidad: data.quantity,
        fechaCaducidad: data.expirationDate,
        tipo: data.type.filter((t): t is string => !!t) // quita undefined
    }

    mutation.mutate(adapted)
}

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="ID" {...register("ID")} />
      <p>{errors.ID?.message}</p>

      <input type="text" placeholder="Nombre" {...register("name")} />
      <p>{errors.name?.message}</p>

      <input type="text" placeholder="Categoria" {...register("category")} />
      <p>{errors.category?.message}</p>

      <input type="number" placeholder="Precio" {...register("price")} />
      <p>{errors.price?.message}</p>

      <input type="number" placeholder="Cantidad" {...register("quantity")} />
      <p>{errors.quantity?.message}</p>

      <input type="date" placeholder="Fecha de Caducidad" {...register("expirationDate")} />
      <p>{errors.expirationDate?.message}</p>

      <label><input type="checkbox" value="Ingredient" {...register("type")} /> Ingredient</label>
      <label><input type="checkbox" value="Perishable" {...register("type")} /> Perishable</label>
      <label><input type="checkbox" value="Organic" {...register("type")} /> Organic</label>
      <p>{errors.type?.message}</p>

      <button type="submit" disabled={mutation.isPending}>Guardar Insumo</button>
    </form>
  )
}

export default IngredientForm