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
        <ul className="category-list">
            {categories.map(cat => (
                <li className="category-item" key={cat.id}>
                    <span className="category-name">{cat.nombre}</span>
                    <div className="category-actions">
                        <button className="category-button edit" onClick={() => onEdit(cat)}>Editar</button>
                        <button className="category-button delete" onClick={() => deleteMutation.mutate(cat.id)}>Eliminar</button>
                    </div>
                </li>
            ))}
        </ul>
    )
    
}

export default CategoryList
