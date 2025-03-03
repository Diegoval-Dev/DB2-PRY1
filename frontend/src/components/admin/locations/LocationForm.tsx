import { useMutation } from "@tanstack/react-query"
import { createLocation } from "@api/admin/locationsApi"
import { useForm } from "react-hook-form"
import { LocationFormData } from "@interfaces/admin/LocationTypes"
import { adaptLocationToRequest } from "@api/admin/locationsApi"

interface Props {
    refetch: () => void
}

const LocationForm = ({ refetch }: Props) => {
    const mutation = useMutation({
        mutationFn: createLocation,
        onSuccess: () => {
            refetch()
            reset()
        },
        onError: () => {
            alert("Error al crear ubicación")
        }
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<LocationFormData>({
        defaultValues: {
            ID: "",
            name: "",
            locationType: []
        }
    })

    const onSubmit = (data: LocationFormData) => {
        const adapted = adaptLocationToRequest(data)
        mutation.mutate(adapted)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="ID" {...register("ID")} />
            <p>{errors.ID?.message}</p>

            <input type="text" placeholder="Nombre" {...register("name")} />
            <p>{errors.name?.message}</p>

            <label><input type="checkbox" value="Location" {...register("locationType")} /> Location</label>
            <label><input type="checkbox" value="Warehouse" {...register("locationType")} /> Warehouse</label>
            <label><input type="checkbox" value="Restaurant" {...register("locationType")} /> Restaurant</label>
            <label><input type="checkbox" value="DistributionCenter" {...register("locationType")} /> Centro de Distribución</label>
            <p>{errors.locationType?.message}</p>

            <button type="submit" disabled={mutation.isPending}>Guardar Ubicación</button>
        </form>
    )
}

export default LocationForm
