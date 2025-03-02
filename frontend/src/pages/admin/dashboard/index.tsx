import DashboardSummary from "@components/admin/dashboard/DashboardSummary"
import DashboardChart from "@components/admin/dashboard/DashboardChart"

const AdminDashboard = () => {
  return (
    <div>
      <h1>Dashboard - Administrador</h1>
      <DashboardSummary />
      <DashboardChart />
    </div>
  )
}

export default AdminDashboard
