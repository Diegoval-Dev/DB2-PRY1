import { useQuery } from "@tanstack/react-query"
import { getAllRoutes } from "@api/admin/routesApi"
import { adaptRouteFromResponse } from "@api/admin/routesApi"
import { Route } from "@interfaces/admin/RoutesTypes"

const RouteList = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["routes"],
        queryFn: getAllRoutes
    })

    if (isLoading) {
        return <p>Cargando rutas...</p>
    }

    if (isError) {
        return <p>Error al cargar las rutas.</p>
    }

    const routes: Route[] = data?.map(adaptRouteFromResponse) || []

    return (
        <div>
            <h2>Listado de Rutas</h2>
            <table border={1} cellPadding={5} style={{ width: "100%", textAlign: "left" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Origen</th>
                        <th>Destino</th>
                        <th>Distancia (km)</th>
                        <th>Tipo Transporte</th>
                    </tr>
                </thead>
                <tbody>
                    {routes.map(route => (
                        <tr key={route.ID}>
                            <td>{route.ID}</td>
                            <td>{route.origin}</td>
                            <td>{route.destination}</td>
                            <td>{route.distance}</td>
                            <td>{route.transportType}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RouteList
