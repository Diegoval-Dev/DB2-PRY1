import { useMutation } from "@tanstack/react-query"
import { deleteCategory } from "@api/admin/categoriesApi"
import { Category } from "@interfaces/admin/CategoryTypes"

interface Props {
    categories: Category[]
    refetch: () => void
}

const CategoryList = ({ categories, refetch }: Props) => {
    const mutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: refetch,
        onError: () => {
            alert("Error al eliminar categoría")
        }
    })

    return (
        <ul>
            {categories.map(category => (
                <li key={category.id}>
                    {category.nombre}
                    <button onClick={() => mutation.mutate(category.id)}>Eliminar</button>
                </li>
            ))}
        </ul>
    )
}

export default CategoryList
