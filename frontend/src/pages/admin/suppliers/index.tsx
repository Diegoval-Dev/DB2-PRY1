import SupplierList from "@components/admin/suppliers/SupplierList"
import SupplierForm from "@components/admin/suppliers/SupplierForm"
import { useQuery } from "@tanstack/react-query"
import { fetchSuppliers } from "@api/admin/suppliersApi"
import { Supplier } from "@interfaces/admin/SupplierTypes"

const SuppliersPage = () => {
  const { data: suppliers = [], isLoading, error, refetch } = useQuery<Supplier[]>({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  })

  return (
    <div>
      <h1>Gestion de Proveedores</h1>
      <SupplierForm refetch={refetch} />
      <SupplierList suppliers={suppliers} isLoading={isLoading} error={error} />
    </div>
  )
}

export default SuppliersPage
