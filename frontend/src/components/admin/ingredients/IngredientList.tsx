import { Ingredient } from "@interfaces/admin/IngredientTypes"
import { deleteIngredient } from "@api/admin/ingredientsApi"
import { useMutation } from "@tanstack/react-query"

interface Props {
    ingredients: Ingredient[]
    isLoading: boolean
    error: unknown
    onEdit: (ingredient: Ingredient) => void
    refetch: () => void
}

const IngredientList = ({ ingredients, isLoading, error, onEdit, refetch }: Props) => {
    const deleteMutation = useMutation({
        mutationFn: deleteIngredient,
        onSuccess: () => refetch(),
        onError: () => alert("Error eliminando insumo")
    })

    if (isLoading) return <p>Cargando...</p>
    if (error) return <p>Error cargando...</p>

    return (
        <ul>
            {ingredients.map(i => (
                <li key={i.ID}>
                    {i.name} - Q{i.price}
                    <button onClick={() => onEdit(i)}>Editar</button>
                    <button onClick={() => deleteMutation.mutate(i.ID)}>Eliminar</button>
                </li>
            ))}
        </ul>
    )
}

export default IngredientList
