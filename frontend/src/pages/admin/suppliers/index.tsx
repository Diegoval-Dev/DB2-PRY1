import SupplierForm, { SupplierFormData } from "@components/admin/suppliers/SupplierForm"
import SupplierList from "@components/admin/suppliers/SupplierList"
import { useQuery } from "@tanstack/react-query"
import { fetchSuppliers } from "@api/admin/suppliersApi"
import { useState } from "react"

const SuppliersPage = () => {
    const { data: suppliers = [], isLoading, error, refetch } = useQuery({
        queryKey: ["suppliers"],
        queryFn: fetchSuppliers
    })

    const [editingSupplier, setEditingSupplier] = useState<SupplierFormData | null>(null)

    return (
        <div>
            <h1>Gestion de Proveedores</h1>
            <SupplierForm
                refetch={refetch}
                initialData={editingSupplier}
                closeModal={() => setEditingSupplier(null)}
            />
            <SupplierList
                suppliers={suppliers}
                isLoading={isLoading}
                error={error}
                refetch={refetch}
                onEdit={(supplier) => setEditingSupplier(supplier)}
            />
        </div>
    )
}

export default SuppliersPage
