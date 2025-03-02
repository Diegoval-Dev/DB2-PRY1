import { useQuery } from "@tanstack/react-query"
import { fetchDashboardSummary } from "@api/admin/dashboard/dashboardApi"
import { DashboardSummaryItem } from "@interfaces/admin/DashboardTypes"

const DashboardSummary = () => {
  const { data: summary = [], isLoading, error } = useQuery<DashboardSummaryItem[]>({
    queryKey: ["dashboardSummary"],
    queryFn: fetchDashboardSummary,
  })

  if (isLoading) return <p>Cargando resumen...</p>
  if (error) return <p>Error cargando resumen.</p>

  return (
    <div style={{ display: "flex", gap: "16px" }}>
      {summary.map((item) => (
        <div key={item.title} style={{ border: "1px solid #ccc", padding: "16px" }}>
          <h3>{item.title}</h3>
          <p>{item.value}</p>
        </div>
      ))}
    </div>
  )
}

export default DashboardSummary
