import InventoryList from "@components/admin/inventory/InventoryList"
import InventoryForm from "@components/admin/inventory/InventoryForm"

const InventoryPage = () => {
  return (
    <div>
      <h1>Gestion de Inventario</h1>
      <InventoryForm />
      <InventoryList />
    </div>
  )
}

export default InventoryPage
