import { useMutation } from "@tanstack/react-query"
import { createSupplier, updateSupplierSupplies } from "@api/admin/suppliersApi"
import { fetchIngredients } from "@api/admin/ingredientsApi"
import { useForm, useFieldArray } from "react-hook-form"
import { SupplierType, SupplierCreate, Supply } from "@interfaces/admin/SupplierTypes"
import { Ingredient } from "@interfaces/admin/IngredientTypes"
import { useQuery } from "@tanstack/react-query"

interface Props {
    refetch: () => void
}

interface SupplierFormData {
    ID: string
    name: string
    location: string
    rating: number
    type: string[]
    supplies: SupplyFormData[]
}

interface SupplyFormData {
    ingredientId: string
    cantidad: number
    fecha: string
}

const SupplierForm = ({ refetch }: Props) => {
    const mutation = useMutation({
        mutationFn: createSupplier,
        onSuccess: async (_, variables) => {
            await updateSupplies(variables.id, getValues().supplies)
            refetch()
            reset()
        },
        onError: () => {
            alert("Error al crear proveedor")
        }
    })

    const { data: ingredients = [] } = useQuery<Ingredient[]>({
        queryKey: ["ingredients"],
        queryFn: fetchIngredients
    })

    const { register, handleSubmit, reset, getValues, control } = useForm<SupplierFormData>({
        defaultValues: {
            ID: "",
            name: "",
            location: "",
            rating: 1,
            type: [],
            supplies: [{ ingredientId: "", cantidad: 0, fecha: "" }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "supplies"
    })

    const onSubmit = async (data: SupplierFormData) => {
        const supplier: SupplierCreate = {
            id: data.ID,
            nombre: data.name,
            ubicación: data.location,
            calificación: data.rating,
            tipo: data.type.filter((t): t is SupplierType => t === "Supplier" || t === "Distributor" || t === "Wholesaler")
        }

        mutation.mutate(supplier)
    }

    const updateSupplies = async (supplierId: string, supplies: SupplyFormData[]) => {
        const adaptedSupplies: Supply[] = supplies.filter(s => s.ingredientId && s.cantidad > 0 && s.fecha).map(s => ({
            ingredientId: s.ingredientId,
            cantidad: s.cantidad,
            fecha: s.fecha
        }))

        await updateSupplierSupplies(supplierId, adaptedSupplies)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="ID" {...register("ID")} />
            <input type="text" placeholder="Nombre" {...register("name")} />
            <input type="text" placeholder="Ubicacion" {...register("location")} />
            <input type="number" placeholder="Calificacion (1-5)" {...register("rating")} />

            <label><input type="checkbox" value="Supplier" {...register("type")} /> Supplier</label>
            <label><input type="checkbox" value="Distributor" {...register("type")} /> Distributor</label>
            <label><input type="checkbox" value="Wholesaler" {...register("type")} /> Wholesaler</label>

            <h3>Productos que provee</h3>
            {fields.map((field, index) => (
                <div key={field.id} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <select {...register(`supplies.${index}.ingredientId` as const)}>
                        <option value="">Seleccione Ingrediente</option>
                        {ingredients.map(ingredient => (
                            <option key={ingredient.ID} value={ingredient.ID}>
                                {ingredient.name} - {ingredient.ID}
                            </option>
                        ))}
                    </select>
                    <input type="number" placeholder="Cantidad" {...register(`supplies.${index}.cantidad` as const)} />
                    <input type="date" placeholder="Fecha de suministro" {...register(`supplies.${index}.fecha` as const)} />
                    <button type="button" onClick={() => remove(index)}>Eliminar</button>
                </div>
            ))}
            <button type="button" onClick={() => append({ ingredientId: "", cantidad: 0, fecha: "" })}>
                Agregar Producto
            </button>

            <button type="submit" disabled={mutation.isPending}>Guardar Proveedor</button>
        </form>
    )
}

export default SupplierForm
