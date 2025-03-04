import { useMutation } from "@tanstack/react-query"
import { createLocation, updateLocation, adaptLocationToRequest } from "@api/admin/locationsApi"
import { useForm } from "react-hook-form"
import { LocationFormData } from "@interfaces/admin/LocationTypes"
import { useEffect } from "react"

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
        <form onSubmit={handleSubmit(onSubmit)}>
            <input placeholder="ID" {...register("ID")} disabled={isEdit} />
            <input placeholder="Nombre" {...register("name")} />

            <label><input type="checkbox" value="Location" {...register("locationType")} /> Location</label>
            <label><input type="checkbox" value="Warehouse" {...register("locationType")} /> Warehouse</label>
            <label><input type="checkbox" value="Restaurant" {...register("locationType")} /> Restaurant</label>
            <label><input type="checkbox" value="DistributionCenter" {...register("locationType")} /> Centro de Distribución</label>

            <button type="submit">
                {isEdit ? "Actualizar Ubicación" : "Guardar Ubicación"}
            </button>
        </form>
    )
}

export default LocationForm
