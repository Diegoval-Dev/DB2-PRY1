import { useQuery } from "@tanstack/react-query"
import { getAllLocations } from "@api/admin/locationsApi"
import { adaptLocationFromResponse } from "@api/admin/locationsApi"
import { Location } from "@interfaces/admin/LocationTypes"

const LocationList = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["locations"],
        queryFn: getAllLocations
    })

    if (isLoading) {
        return <p>Cargando ubicaciones...</p>
    }

    const locations: Location[] = data?.map(adaptLocationFromResponse) || []

    return (
        <div>
            <h3>Listado de Ubicaciones</h3>
            <ul>
                {locations.map(location => (
                    <li key={location.ID}>
                        {location.ID} - {location.name} ({location.locationType.join(", ")})
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LocationList
