import { Supplier } from "@interfaces/admin/SupplierTypes"
import { useMutation } from "@tanstack/react-query"
import { deleteSupplier, deleteMultipleSuppliers } from "@api/admin/suppliersApi"
import { useState } from "react"
import styles from './SupplierList.module.css'

interface Props {
    suppliers: Supplier[]
    isLoading: boolean
    error: unknown
    onEdit: (supplier: Supplier) => void
    refetch: () => void
}

const SupplierList = ({ suppliers, isLoading, error, onEdit, refetch }: Props) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteSupplier(id),
        onSuccess: () => refetch(),
        onError: () => alert("Error al eliminar proveedor")
    })

    const bulkDeleteMutation = useMutation({
        mutationFn: (ids: string[]) => deleteMultipleSuppliers(ids),
        onSuccess: () => {
            setSelectedIds([]) // Limpia seleccion
            refetch()
        },
        onError: () => alert("Error al eliminar proveedores")
    })

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
        )
    }

    if (isLoading) return <p>Cargando proveedores...</p>
    if (error) return <p>Error al cargar proveedores</p>

    return (
        <div className={styles.supplierListContainer}>
            <button
                className={styles.bulkDeleteButton}
                onClick={() => bulkDeleteMutation.mutate(selectedIds)}
                disabled={selectedIds.length === 0 || bulkDeleteMutation.isPending}
            >
                Eliminar Seleccionados ({selectedIds.length})
            </button>
    
            <ul className={styles.supplierList}>
                {suppliers.map(supplier => (
                    <li className={styles.supplierItem} key={supplier.ID}>
                        <input
                            className={styles.checkbox}
                            type="checkbox"
                            checked={selectedIds.includes(supplier.ID)}
                            onChange={() => toggleSelect(supplier.ID)}
                        />
                        <span className={styles.supplierInfo}>
                            {supplier.name} - {supplier.location} - {supplier.rating} ⭐️
                        </span>
                        <div className={styles.actions}>
                            <button
                                className={`${styles.actionButton} ${styles.editButton}`}
                                onClick={() => onEdit(supplier)}
                            >
                                Editar
                            </button>
                            <button
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                onClick={() => deleteMutation.mutate(supplier.ID)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
    
}

export default SupplierList
