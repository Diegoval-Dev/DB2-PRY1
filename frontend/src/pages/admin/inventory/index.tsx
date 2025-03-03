import InventoryList from "@components/admin/inventory/InventoryList"
import InventoryForm from "@components/admin/inventory/InventoryForm"
import { useQuery } from "@tanstack/react-query"
import { fetchInventories } from "@api/admin/inventoryApi"
import { Inventory } from "@interfaces/admin/InventoryTypes"

const InventoryPage = () => {
  const { data: inventories = [], isLoading, error, refetch } = useQuery<Inventory[]>({
    queryKey: ["inventories"],
    queryFn: fetchInventories
  })

  return (
    <div>
      <h1>Gestion de Inventario</h1>
      <InventoryForm refetch={refetch} />
      <InventoryList inventories={inventories} isLoading={isLoading} error={error} />
    </div>
  )
}

export default InventoryPage
