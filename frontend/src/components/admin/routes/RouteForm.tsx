import { useMutation } from "@tanstack/react-query"
import { createRoute, updateRoute, adaptRouteToRequest } from "@api/admin/routesApi"
import { useForm } from "react-hook-form"
import { RouteFormData } from "@interfaces/admin/RoutesTypes"
import { useEffect } from "react"

interface Props {
    refetch: () => void
    initialData?: RouteFormData
    closeModal?: () => void
}

const RouteForm = ({ refetch, initialData, closeModal }: Props) => {
    const isEdit = !!initialData

    const mutation = useMutation({
        mutationFn: (data: RouteFormData) => {
            const adapted = adaptRouteToRequest(data)
            return isEdit ? updateRoute(data.ID, adapted) : createRoute(adapted)
        },
        onSuccess: () => {
            refetch()
            reset()
            closeModal?.()
        },
        onError: () => alert("Error al guardar ruta")
    })

    const {
        register,
        handleSubmit,
        reset
    } = useForm<RouteFormData>({
        defaultValues: initialData || {
            ID: "",
            origin: "",
            destination: "",
            distance: 0,
            transportType: ""
        }
    })

    useEffect(() => {
        if (initialData) reset(initialData)
    }, [initialData, reset])

    const onSubmit = (data: RouteFormData) => {
        mutation.mutate(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input placeholder="ID" {...register("ID")} disabled={isEdit} />
            <input placeholder="Origen (ID Ubicación)" {...register("origin")} />
            <input placeholder="Destino (ID Ubicación)" {...register("destination")} />
            <input type="number" step="any" placeholder="Distancia" {...register("distance")} />

            <select {...register("transportType")}>
                <option value="">Seleccione tipo</option>
                <option value="Refrigerated">Refrigerated</option>
                <option value="Express">Express</option>
                <option value="Normal">Normal</option>
            </select>

            <button type="submit">
                {isEdit ? "Actualizar Ruta" : "Guardar Ruta"}
            </button>
        </form>
    )
}

export default RouteForm
