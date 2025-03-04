import { Inventory } from "@interfaces/admin/InventoryTypes"
import { deleteInventory } from "@api/admin/inventoryApi"
import { useMutation } from "@tanstack/react-query"
import styles from './InventoryList.module.css'

interface Props {
    inventories: Inventory[]
    isLoading: boolean
    error: unknown
    onEdit: (inventory: Inventory) => void
    refetch: () => void
}

const InventoryList = ({ inventories, isLoading, error, onEdit, refetch }: Props) => {
    const deleteMutation = useMutation({
        mutationFn: deleteInventory,
        onSuccess: () => refetch(),
        onError: () => alert("Error eliminando inventario")
    })

    if (isLoading) return <p>Cargando inventarios...</p>
    if (error) return <p>Error cargando inventarios.</p>

    return (
        <ul className={styles.inventoryList}>
            {inventories.map(inv => (
                <li className={styles.inventoryItem} key={inv.ID}>
                    <span className={styles.inventoryInfo}>
                        {inv.ID} - {inv.location} - {inv.capacity} capacidad - {inv.supplyQuantity} insumos
                    </span>
                    <div className={styles.actions}>
                        <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => onEdit(inv)}>
                            Editar
                        </button>
                        <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => deleteMutation.mutate(inv.ID)}>
                            Eliminar
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default InventoryList
