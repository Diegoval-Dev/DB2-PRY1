import { Link } from "react-router-dom"

const Sidebar = () => {
  return (
    <nav style={{ width: "250px", backgroundColor: "#f4f4f4", padding: "20px" }}>
      <h3>Admin Menu</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/locations">Ubicaciones</Link></li>
        <li><Link to="/admin/suppliers">Proveedores</Link></li>
        <li><Link to="/admin/inventory">Inventario</Link></li>
        <li><Link to="/admin/categories">Categorias</Link></li>
        <li><Link to="/admin/ingredients">Insumos</Link></li>
        <li><Link to="/admin/orders">Ordenes</Link></li>
        <li><Link to="/admin/routes">Rutas</Link></li>
        <li><a href="/">Salir al sitio publico</a></li>
      </ul>
    </nav>
  )
}

export default Sidebar
