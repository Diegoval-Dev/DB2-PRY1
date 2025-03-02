import SupplierList from "@components/admin/suppliers/SupplierList";
import SupplierForm from "@components/admin/suppliers/SupplierForm";

const SuppliersPage = () => {
  return (
    <div>
      <h1>Gestion de Proveedores</h1>
      <SupplierForm />
      <SupplierList />
    </div>
  );
};

export default SuppliersPage;
