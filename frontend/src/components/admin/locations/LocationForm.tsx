import { useMutation } from "@tanstack/react-query"
import { createLocation, updateLocation, adaptLocationToRequest } from "@api/admin/locationsApi"
import { useForm } from "react-hook-form"
import { LocationFormData } from "@interfaces/admin/LocationTypes"
import { useEffect } from "react"
import styles from './LocationForm.module.css'

interface Props {
    refetch: () => void
    initialData?: LocationFormData
    closeModal?: () => void
}

const LocationForm = ({ refetch, initialData, closeModal }: Props) => {
    const isEdit = !!initialData

    const mutation = useMutation({
        mutationFn: (data: LocationFormData) => {
            const adapted = adaptLocationToRequest(data)
            return isEdit ? updateLocation(data.ID, adapted) : createLocation(adapted)
        },
        onSuccess: () => {
            refetch()
            reset()
            closeModal?.()
        },
        onError: () => {
            alert("Error al guardar ubicación")
        }
    })

    const {
        register,
        handleSubmit,
        reset
    } = useForm<LocationFormData>({
        defaultValues: initialData || {
            ID: "",
            name: "",
            locationType: []
        }
    })

    useEffect(() => {
        if (initialData) reset(initialData)
    }, [initialData, reset])

    const onSubmit = (data: LocationFormData) => {
        mutation.mutate(data)
    }
    return (
        <form className={styles.locationForm} onSubmit={handleSubmit(onSubmit)}>
            <input className={styles.input} placeholder="ID" {...register("ID")} disabled={isEdit} />
            <input className={styles.input} placeholder="Nombre" {...register("name")} />
    
            <div className={styles.checkboxGroup}>
                <label><input type="checkbox" value="Location" {...register("locationType")} /> Location</label>
                <label><input type="checkbox" value="Warehouse" {...register("locationType")} /> Warehouse</label>
                <label><input type="checkbox" value="Restaurant" {...register("locationType")} /> Restaurant</label>
                <label><input type="checkbox" value="DistributionCenter" {...register("locationType")} /> Centro de Distribucion</label>
            </div>
    
            <button className={styles.submitButton} type="submit">
                {isEdit ? "Actualizar Ubicacion" : "Guardar Ubicacion"}
            </button>
        </form>
    )
}

export default LocationForm
