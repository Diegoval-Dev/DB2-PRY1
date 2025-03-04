import { Category } from "@interfaces/admin/CategoryTypes"
import { deleteCategory } from "@api/admin/categoriesApi"
import { useMutation } from "@tanstack/react-query"

interface Props {
    categories: Category[]
    isLoading: boolean
    error: unknown
    onEdit: (category: Category) => void
    refetch: () => void
}

const CategoryList = ({ categories, isLoading, error, onEdit, refetch }: Props) => {
    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => refetch(),
        onError: () => alert("Error eliminando categoría")
    })

    if (isLoading) return <p>Cargando categorías...</p>
    if (error) return <p>Error cargando categorías.</p>

    return (
        <ul>
            {categories.map(cat => (
                <li key={cat.id}>
                    {cat.nombre}
                    <button onClick={() => onEdit(cat)}>Editar</button>
                    <button onClick={() => deleteMutation.mutate(cat.id)}>Eliminar</button>
                </li>
            ))}
        </ul>
    )
}

export default CategoryList
