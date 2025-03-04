import { Inventory } from "@interfaces/admin/InventoryTypes"
import { deleteInventory } from "@api/admin/inventoryApi"
import { useMutation } from "@tanstack/react-query"

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
        <ul>
            {inventories.map(inv => (
                <li key={inv.ID}>
                    {inv.ID} - {inv.location} - {inv.capacity} capacidad - {inv.supplyQuantity} insumos
                    <button onClick={() => onEdit(inv)}>Editar</button>
                    <button onClick={() => deleteMutation.mutate(inv.ID)}>Eliminar</button>
                </li>
            ))}
        </ul>
    )
}

export default InventoryList
