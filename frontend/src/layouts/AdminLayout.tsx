import { Outlet } from "react-router-dom"
import Sidebar from "@components/admin/Sidebar"
import Header from "@components/admin/Header"

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto" }}>
        <Header />
        <div style={{ padding: "20px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
