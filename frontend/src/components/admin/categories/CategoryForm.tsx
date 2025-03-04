import { useMutation } from "@tanstack/react-query"
import { createCategory } from "@api/admin/categoriesApi"
import { useForm } from "react-hook-form"

interface Props {
    refetch: () => void
}

interface CategoryFormData {
    id: string
    nombre: string
}

const CategoryForm = ({ refetch }: Props) => {
    const mutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            refetch()
            reset()
        },
        onError: () => {
            alert("Error al crear categoría")
        }
    })

    const { register, handleSubmit, reset } = useForm<CategoryFormData>({
        defaultValues: {
            id: "",
            nombre: ""
        }
    })

    const onSubmit = (data: CategoryFormData) => {
        mutation.mutate(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="ID" {...register("id")} />
            <input type="text" placeholder="Nombre" {...register("nombre")} />
            <button type="submit">Guardar Categoría</button>
        </form>
    )
}

export default CategoryForm
