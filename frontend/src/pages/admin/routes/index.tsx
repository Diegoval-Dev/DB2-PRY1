import { useQuery } from "@tanstack/react-query"
import { getAllRoutes } from "@api/admin/routesApi"
import RouteForm from "@components/admin/routes/RouteForm"
import RouteList from "@components/admin/routes/RouteList"
import { useState } from "react"
import { Route } from "@interfaces/admin/RoutesTypes"

const RoutesPage = () => {
    const { data = [], isLoading, error, refetch } = useQuery({
        queryKey: ["routes"],
        queryFn: getAllRoutes
    })

    const [editingRoute, setEditingRoute] = useState<Route | null>(null)

    return (
        <div>
            <h1>Gestión de Rutas</h1>
            <RouteForm refetch={refetch} initialData={editingRoute} closeModal={() => setEditingRoute(null)} />
            <RouteList
                routes={data}
                isLoading={isLoading}
                error={error}
                refetch={refetch}
                onEdit={(route) => setEditingRoute(route)}
            />
        </div>
    )
}

export default RoutesPage
