import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/suppliers`)
      .then(response => setSuppliers(response.data))
      .catch(error => console.error("Error cargando proveedores:", error));
  }, []);

  return (
    <div>
      <h1>Proveedores</h1>
      <ul>
        {suppliers.map((supplier: any) => (
          <li key={supplier.ID}>
            {supplier.nombre} - {supplier.ubicación} (Calificación: {supplier.calificación})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suppliers;
