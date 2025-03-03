import { Inventory } from "@interfaces/admin/InventoryTypes"

interface Props {
  inventories: Inventory[]
  isLoading: boolean
  error: unknown
}

const InventoryList = ({ inventories, isLoading, error }: Props) => {
  if (isLoading) return <p>Cargando inventarios...</p>
  if (error) return <p>Error cargando inventarios.</p>

  return (
    <ul>
      {inventories.map(inventory => (
        <li key={inventory.ID}>
          {inventory.location} - Capacidad: {inventory.capacity} - Insumos: {inventory.supplyQuantity} - Tipos: {inventory.type.join(", ")}
        </li>
      ))}
    </ul>
  )
}

export default InventoryList
