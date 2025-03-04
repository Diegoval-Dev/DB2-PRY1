import { Category } from "@interfaces/admin/CategoryTypes"
import { deleteCategory } from "@api/admin/categoriesApi"
import { useMutation } from "@tanstack/react-query"
import styles from './CategoryList.module.css'

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
        <ul className={styles.categoryList}>
            {categories.map(cat => (
                <li className={styles.categoryItem} key={cat.id}>
                    <span className={styles.categoryName}>{cat.nombre}</span>
                    <div className={styles.categoryActions}>
                        <button className={`${styles.categoryButton} ${styles.edit}`} onClick={() => onEdit(cat)}>Editar</button>
                        <button className={`${styles.categoryButton} ${styles.delete}`} onClick={() => deleteMutation.mutate(cat.id)}>Eliminar</button>
                    </div>
                </li>
            ))}
        </ul>
    )
    
}

export default CategoryList
