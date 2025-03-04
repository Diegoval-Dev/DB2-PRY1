import { Link } from "react-router-dom"
import styles from './Sidebar.module.css'

const Sidebar = () => {
  return (
    <nav className={styles.sidebar}>
        <h3 className={styles.title}>Admin Menu</h3>
        <ul className={styles.menu}>
            <li><Link className={styles.link} to="/admin/locations">Ubicaciones</Link></li>
            <li><Link className={styles.link} to="/admin/suppliers">Proveedores</Link></li>
            <li><Link className={styles.link} to="/admin/inventory">Inventario</Link></li>
            <li><Link className={styles.link} to="/admin/categories">Categorias</Link></li>
            <li><Link className={styles.link} to="/admin/ingredients">Insumos</Link></li>
            <li><Link className={styles.link} to="/admin/orders">Ordenes</Link></li>
            <li><a className={styles.link} href="/">Salir al sitio publico</a></li>
        </ul>
    </nav>
)
}

export default Sidebar
