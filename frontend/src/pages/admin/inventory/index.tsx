import { useQuery } from "@tanstack/react-query"
import { fetchInventories } from "@api/admin/inventoryApi"
import InventoryForm from "@components/admin/inventory/InventoryForm"
import InventoryList from "@components/admin/inventory/InventoryList"
import { useState } from "react"
import { Inventory } from "@interfaces/admin/InventoryTypes"

const InventoryPage = () => {
    const { data = [], isLoading, error, refetch } = useQuery({
        queryKey: ["inventories"],
        queryFn: fetchInventories
    })

    const [editingInventory, setEditingInventory] = useState<Inventory | null>(null)

    return (
        <div>
            <h1>Gestion de Inventarios</h1>
            <InventoryForm refetch={refetch} initialData={editingInventory} closeModal={() => setEditingInventory(null)} />
            <InventoryList
                inventories={data}
                isLoading={isLoading}
                error={error}
                refetch={refetch}
                onEdit={(inventory) => setEditingInventory(inventory)}
            />
        </div>
    )
}

export default InventoryPage
