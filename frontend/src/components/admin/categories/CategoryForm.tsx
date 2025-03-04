import { useMutation } from "@tanstack/react-query"
import { createCategory, updateCategory } from "@api/admin/categoriesApi"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { Category } from "@interfaces/admin/CategoryTypes"
import "./CategoryForm.css"

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
        <form className="category-form" onSubmit={handleSubmit(onSubmit)}>
            <input className="category-input" placeholder="ID" {...register("id")} disabled={isEdit} />
            <input className="category-input" placeholder="Nombre" {...register("nombre")} />
            <button className="category-button" type="submit">
                {isEdit ? "Actualizar Categoria" : "Guardar Categoria"}
            </button>
        </form>
    )    
}

export default CategoryForm
