import { Ingredient } from "@interfaces/admin/IngredientTypes"
import { deleteIngredient } from "@api/admin/ingredientsApi"
import { useMutation } from "@tanstack/react-query"
import styles from './IngredientList.module.css'

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
        <ul className={styles.ingredientList}>
            {ingredients.map(i => (
                <li className={styles.ingredientItem} key={i.ID}>
                    <span className={styles.ingredientInfo}>{i.name} - Q{i.price}</span>
                    <div className={styles.actions}>
                        <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => onEdit(i)}>
                            Editar
                        </button>
                        <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => deleteMutation.mutate(i.ID)}>
                            Eliminar
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default IngredientList
