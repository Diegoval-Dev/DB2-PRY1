import { useQuery } from "@tanstack/react-query"
import { fetchDashboardMetrics, DashboardMetrics } from "@api/admin/dashboardApi"

const Dashboard = () => {
    const { data: metrics, isLoading, error } = useQuery<DashboardMetrics>({
        queryKey: ["dashboardMetrics"],
        queryFn: fetchDashboardMetrics
    })

    if (isLoading) return <p>Cargando métricas...</p>
    if (error) return <p>Error al cargar métricas</p>

    return (
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
                Proveedores: {metrics?.totalSuppliers ?? 0}
            </div>
            <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
                Ingredientes: {metrics?.totalIngredients ?? 0}
            </div>
            <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
                Inventarios: {metrics?.totalInventories ?? 0}
            </div>
            <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
                Ubicaciones: {metrics?.totalLocations ?? 0}
            </div>
            <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
                Rutas: {metrics?.totalRoutes ?? 0}
            </div>
            <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
                Categorías: {metrics?.totalCategories ?? 0}
            </div>
        </div>
    )
}

export default Dashboard
