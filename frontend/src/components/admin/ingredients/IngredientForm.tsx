import { useMutation, useQuery } from "@tanstack/react-query"
import { createIngredient } from "@api/admin/ingredientsApi"
import { fetchInventories } from "@api/admin/inventoryApi"
import { fetchCategories } from "@api/admin/categoriesApi"
import { useForm, useFieldArray } from "react-hook-form"
import { CreateIngredientRequest, StorageRequest } from "@interfaces/admin/IngredientTypes"

interface Props {
    refetch: () => void
}

interface IngredientFormData {
    ID: string
    name: string
    price: number
    expirationDate: string
    type: string[]
    categoryId: string
    storages: StorageRequest[]
}

const IngredientForm = ({ refetch }: Props) => {
    const mutation = useMutation({
        mutationFn: createIngredient,
        onSuccess: () => {
            refetch()
            reset()
        },
        onError: () => {
            alert("Error al crear insumo")
        }
    })

    const { data: inventories = [] } = useQuery({
        queryKey: ["inventories"],
        queryFn: fetchInventories
    })

    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories
    })

    const { register, handleSubmit, reset, control } = useForm<IngredientFormData>({
        defaultValues: {
            ID: "",
            name: "",
            price: 0,
            expirationDate: "",
            type: [],
            categoryId: "",
            storages: [{ inventoryId: "", cantidad: 0 }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "storages"
    })

    const onSubmit = (data: IngredientFormData) => {
        const adapted: CreateIngredientRequest = {
            id: data.ID,
            nombre: data.name,
            categoría: "", // Siempre vacío, lo llena el backend al buscar la categoría
            precio: data.price,
            fechaCaducidad: data.expirationDate,
            tipo: data.type,
            categoryId: data.categoryId,
            storages: data.storages.filter(storage => storage.inventoryId && storage.cantidad > 0)
        }

        mutation.mutate(adapted)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="ID" {...register("ID")} />
            <input type="text" placeholder="Nombre" {...register("name")} />
            <input type="number" placeholder="Precio" {...register("price")} />
            <input type="date" placeholder="Fecha de Caducidad" {...register("expirationDate")} />

            <div>
                <label><input type="checkbox" value="Ingredient" {...register("type")} /> Ingredient</label>
                <label><input type="checkbox" value="Perishable" {...register("type")} /> Perishable</label>
                <label><input type="checkbox" value="Organic" {...register("type")} /> Organic</label>
            </div>

            <select {...register("categoryId")}>
                <option value="">Seleccione Categoría</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.nombre}
                    </option>
                ))}
            </select>

            <h3>Almacenamiento</h3>
            {fields.map((field, index) => (
                <div key={field.id} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <select {...register(`storages.${index}.inventoryId` as const)}>
                        <option value="">Seleccione Inventario</option>
                        {inventories.map(inventory => (
                            <option key={inventory.ID} value={inventory.ID}>
                                {inventory.ID} - {inventory.location}
                            </option>
                        ))}
                    </select>
                    <input type="number" placeholder="Cantidad" {...register(`storages.${index}.cantidad` as const)} />
                    <button type="button" onClick={() => remove(index)}>Eliminar</button>
                </div>
            ))}
            <button type="button" onClick={() => append({ inventoryId: "", cantidad: 0 })}>
                Agregar Inventario
            </button>

            <button type="submit" disabled={mutation.isPending}>Guardar Insumo</button>
        </form>
    )
}

export default IngredientForm
