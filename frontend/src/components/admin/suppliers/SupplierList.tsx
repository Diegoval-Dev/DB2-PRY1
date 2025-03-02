import { useQuery } from "@tanstack/react-query";
import { fetchSuppliers } from "@api/admin/suppliers/suppliersApi";
import { Supplier } from "@interfaces/admin/SupplierTypes";


const SupplierList = () => {
  const { data: suppliers = [], isLoading, error } = useQuery<Supplier[]>({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  if (isLoading) return <p>Cargando proveedores...</p>;
  if (error) return <p>Error cargando proveedores.</p>;

  return (
    <div>
      <h1>Proveedores</h1>
      <ul>
        {suppliers.map((supplier) => (
          <li key={supplier.ID}>
            {supplier.name} - {supplier.location} (Calificacion: {supplier.rating})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierList;
