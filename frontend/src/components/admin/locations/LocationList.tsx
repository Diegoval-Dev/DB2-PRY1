import { Location } from "@interfaces/admin/LocationTypes"
import { deleteLocation } from "@api/admin/locationsApi"
import { useMutation } from "@tanstack/react-query"
import styles from './LocationList.module.css'
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
        <ul className={styles.locationList}>
            {locations.map(location => (
                <li className={styles.locationItem} key={location.id}>
                    <span className={styles.locationInfo}>
                        {location.nombre} - Tipos: {location.tipoUbicacion.join(", ")}
                    </span>
                    <div className={styles.actions}>
                        <button
                            className={`${styles.actionButton} ${styles.editButton}`}
                            onClick={() => onEdit(location)}
                        >
                            Editar
                        </button>
                        <button
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() => deleteMutation.mutate(location.id)}
                        >
                            Eliminar
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default LocationList
