import { useMutation, useQuery } from "@tanstack/react-query"
import { createInventory, updateInventory } from "@api/admin/inventoryApi"
import { getAllLocations } from "@api/admin/locationsApi"
import { useForm } from "react-hook-form"
import { Inventory } from "@interfaces/admin/InventoryTypes"
import { useEffect } from "react"

interface Props {
    refetch: () => void
    initialData?: Inventory
    closeModal?: () => void
}

const InventoryForm = ({ refetch, initialData, closeModal }: Props) => {
    const isEdit = !!initialData

    const mutation = useMutation({
        mutationFn: (data: Inventory) => {
            if (isEdit) {
                return updateInventory(data.ID, {
                    capacidad: data.capacity,
                    cantidadInsumo: data.supplyQuantity,
                    tipo: data.type,
                    ubicacion: data.location
                })
            } else {
                return createInventory(data)
            }
        },
        onSuccess: () => {
            refetch()
            reset()
            closeModal?.()
        },
        onError: () => alert("Error al guardar inventario")
    })

    const { data: locations = [] } = useQuery({
        queryKey: ["locations"],
        queryFn: getAllLocations
    })

    const {
        register,
        handleSubmit,
        reset
    } = useForm<Inventory>({
        defaultValues: initialData || {
            ID: "",
            location: "",
            capacity: 0,
            supplyQuantity: 0,
            type: []
        }
    })

    useEffect(() => {
        if (initialData) {
            reset(initialData)
        }
    }, [initialData, reset])

    const onSubmit = (data: Inventory) => {
        mutation.mutate(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input placeholder="ID" {...register("ID")} disabled={isEdit} />

            <select {...register("location")}>
                <option value="">Seleccione una ubicación</option>
                {locations.map(location => (
                    <option key={location.id} value={location.id}>
                        {location.nombre} ({location.id})
                    </option>
                ))}
            </select>

            <input type="number" step="any" placeholder="Capacidad" {...register("capacity")} />
            <input type="number" placeholder="Cantidad de insumos" {...register("supplyQuantity")} />

            <label><input type="checkbox" value="Inventory" {...register("type")} /> Inventory</label>
            <label><input type="checkbox" value="ColdStorage" {...register("type")} /> ColdStorage</label>
            <label><input type="checkbox" value="DryStorage" {...register("type")} /> DryStorage</label>

            <button type="submit">
                {isEdit ? "Actualizar Inventario" : "Guardar Inventario"}
            </button>
        </form>
    )
}

export default InventoryForm
