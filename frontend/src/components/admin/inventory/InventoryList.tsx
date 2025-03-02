import { useQuery } from "@tanstack/react-query"
import { fetchInventory } from "@api/admin/inventoryApi"
import { Inventory } from "@interfaces/admin/InventoryTypes"

const InventoryList = () => {
  const { data: inventory = [], isLoading, error } = useQuery<Inventory[]>({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
  })

  if (isLoading) return <p>Cargando inventario...</p>
  if (error) return <p>Error cargando inventario.</p>

  return (
    <ul>
      {inventory.map((item) => (
        <li key={item.ID}>
          {item.location} - Capacidad: {item.capacity} - Almacenado: {item.storedQuantity}
        </li>
      ))}
    </ul>
  )
}

export default InventoryList
