import { useMutation, useQuery } from "@tanstack/react-query"
import { createInventory } from "@api/admin/inventoryApi"
import { getAllLocations } from "@api/admin/locationsApi"
import { Inventory } from "@interfaces/admin/InventoryTypes"
import { useForm } from "react-hook-form"

interface Props {
    refetch: () => void
}

const InventoryForm = ({ refetch }: Props) => {
    const mutation = useMutation({
        mutationFn: createInventory,
        onSuccess: () => {
            refetch()
            reset()
        },
        onError: () => {
            alert("Error al crear inventario")
        }
    })

    const { data: locations = [] } = useQuery({
        queryKey: ["locations"],
        queryFn: getAllLocations
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<Inventory>({
        defaultValues: {
            ID: "",
            location: "",
            capacity: 0,
            supplyQuantity: 0,
            storedQuantity: 0,
            type: []
        }
    })

    const onSubmit = (data: Inventory) => {
        mutation.mutate(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="ID" {...register("ID")} />
            <p>{errors.ID?.message}</p>

            {/* Select para ubicación */}
            <select {...register("location")}>
                <option value="">Seleccione una ubicación</option>
                {locations.map(location => (
                    <option key={location.id} value={location.id}>
                        {location.nombre} ({location.id})
                    </option>
                ))}
            </select>
            <p>{errors.location?.message}</p>

            <input type="number" placeholder="Capacidad" {...register("capacity")} />
            <p>{errors.capacity?.message}</p>

            <input type="number" placeholder="Cantidad de insumos" {...register("supplyQuantity")} />
            <p>{errors.supplyQuantity?.message}</p>

            <label><input type="checkbox" value="Inventory" {...register("type")} /> Inventory</label>
            <label><input type="checkbox" value="ColdStorage" {...register("type")} /> ColdStorage</label>
            <label><input type="checkbox" value="DryStorage" {...register("type")} /> DryStorage</label>
            <p>{errors.type?.message}</p>

            <button type="submit" disabled={mutation.isPending}>Guardar Inventario</button>
        </form>
    )
}

export default InventoryForm
