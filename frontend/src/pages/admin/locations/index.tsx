import LocationForm from "@components/admin/locations/LocationForm"
import LocationList from "@components/admin/locations/LocationList"
import { useQueryClient } from "@tanstack/react-query"

const LocationsPage = () => {
    const queryClient = useQueryClient()

    const refetchLocations = () => {
        queryClient.invalidateQueries({ queryKey: ["locations"] })
    }

    return (
        <div>
            <h1>Gestión de Ubicaciones</h1>

            <section>
                <h2>Crear Nueva Ubicación</h2>
                <LocationForm refetch={refetchLocations} />
            </section>

            <section>
                <h2>Listado de Ubicaciones</h2>
                <LocationList />
            </section>
        </div>
    )
}

export default LocationsPage
