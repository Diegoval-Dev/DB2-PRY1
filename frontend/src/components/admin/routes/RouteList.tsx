import { Route } from "@interfaces/admin/RoutesTypes"
import { deleteRoute } from "@api/admin/routesApi"
import { useMutation } from "@tanstack/react-query"

interface Props {
    routes: Route[]
    isLoading: boolean
    error: unknown
    onEdit: (route: Route) => void
    refetch: () => void
}

const RouteList = ({ routes, isLoading, error, onEdit, refetch }: Props) => {
    const deleteMutation = useMutation({
        mutationFn: deleteRoute,
        onSuccess: () => refetch(),
        onError: () => alert("Error eliminando ruta")
    })

    if (isLoading) return <p>Cargando rutas...</p>
    if (error) return <p>Error cargando rutas.</p>

    return (
        <ul>
            {routes.map(route => (
                <li key={route.ID}>
                    {route.ID}: {route.origin} → {route.destination} ({route.distance} km - {route.transportType})
                    <button onClick={() => onEdit(route)}>Editar</button>
                    <button onClick={() => deleteMutation.mutate(route.ID)}>Eliminar</button>
                </li>
            ))}
        </ul>
    )
}

export default RouteList
