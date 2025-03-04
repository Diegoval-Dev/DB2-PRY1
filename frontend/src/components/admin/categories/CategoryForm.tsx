import { useMutation } from "@tanstack/react-query"
import { createCategory, updateCategory } from "@api/admin/categoriesApi"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { Category } from "@interfaces/admin/CategoryTypes"

interface Props {
    refetch: () => void
    initialData?: Category
    closeModal?: () => void
}

const CategoryForm = ({ refetch, initialData, closeModal }: Props) => {
    const isEdit = !!initialData

    const mutation = useMutation({
        mutationFn: (data: Category) => {
            return isEdit ? updateCategory(data.id, data) : createCategory(data)
        },
        onSuccess: () => {
            refetch()
            reset()
            closeModal?.()
        },
        onError: () => alert("Error al guardar categoría")
    })

    const { register, handleSubmit, reset } = useForm<Category>({
        defaultValues: initialData || {
            id: "",
            nombre: ""
        }
    })

    useEffect(() => {
        if (initialData) reset(initialData)
    }, [initialData, reset])

    const onSubmit = (data: Category) => {
        mutation.mutate(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input placeholder="ID" {...register("id")} disabled={isEdit} />
            <input placeholder="Nombre" {...register("nombre")} />
            <button type="submit">
                {isEdit ? "Actualizar Categoría" : "Guardar Categoría"}
            </button>
        </form>
    )
}

export default CategoryForm
