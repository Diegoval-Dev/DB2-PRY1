import LocationForm from "@components/admin/locations/LocationForm"
import { LocationFormData } from "@interfaces/admin/LocationTypes"
import LocationList from "@components/admin/locations/LocationList"
import { useQuery } from "@tanstack/react-query"
import { getAllLocations } from "@api/admin/locationsApi"
import { useState } from "react"
import { Location } from "@interfaces/admin/LocationTypes"

const LocationsPage = () => {
    const { data: locations = [], isLoading, error, refetch } = useQuery({
        queryKey: ["locations"],
        queryFn: getAllLocations
    })

    const [editingLocation, setEditingLocation] = useState<LocationFormData | null>(null)

    const handleEdit = (location: Location) => {
        const adaptedLocation: LocationFormData = {
            ID: location.id,                 // adaptar
            name: location.nombre,           // adaptar
            locationType: location.tipoUbicacion // adaptar
        }

        setEditingLocation(adaptedLocation)
    }

    return (
        <div>
            <h1>Gestión de Ubicaciones</h1>
            <LocationForm
                refetch={refetch}
                initialData={editingLocation}
                closeModal={() => setEditingLocation(null)}
            />
            <LocationList
                locations={locations}
                isLoading={isLoading}
                error={error}
                onEdit={handleEdit} // usar la adaptadora
                refetch={refetch}
            />
        </div>
    )
}

export default LocationsPage
