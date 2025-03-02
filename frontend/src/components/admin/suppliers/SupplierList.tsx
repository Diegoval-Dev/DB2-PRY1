import { Supplier } from "@interfaces/admin/SupplierTypes"

interface Props {
  suppliers: Supplier[]
  isLoading: boolean
  error: unknown
}

const SupplierList = ({ suppliers, isLoading, error }: Props) => {
  if (isLoading) return <p>Cargando proveedores...</p>
  if (error) return <p>Error cargando proveedores.</p>

  return (
    <div>
      <h1>Proveedores</h1>
      <ul>
        {suppliers.map((supplier) => (
          <li key={supplier.ID}>
            {supplier.name} - {supplier.location} (Calificacion: {supplier.rating}) - Tipo: {supplier.type}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SupplierList
