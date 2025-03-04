import { Location } from "@interfaces/admin/LocationTypes"
import { deleteLocation } from "@api/admin/locationsApi"
import { useMutation } from "@tanstack/react-query"

interface Props {
    locations: Location[]
    isLoading: boolean
    error: unknown
    onEdit: (location: Location) => void
    refetch: () => void
}

const LocationList = ({ locations, isLoading, error, onEdit, refetch }: Props) => {
    const deleteMutation = useMutation({
        mutationFn: deleteLocation,
        onSuccess: () => refetch(),
        onError: () => alert("Error eliminando ubicación")
    })

    if (isLoading) return <p>Cargando ubicaciones...</p>
    if (error) return <p>Error cargando ubicaciones.</p>

    return (
        <ul>
            {locations.map(location => (
                <li key={location.id}>
                    {location.nombre} - Tipos: {location.tipoUbicacion.join(", ")}
                    <button onClick={() => onEdit(location)}>Editar</button>
                    <button onClick={() => deleteMutation.mutate(location.id)}>Eliminar</button>
                </li>
            ))}
        </ul>
    )
}

export default LocationList
