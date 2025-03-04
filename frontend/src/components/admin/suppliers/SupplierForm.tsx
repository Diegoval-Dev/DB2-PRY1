import { useMutation } from "@tanstack/react-query"
import { createSupplier, updateSupplier, updateSupplierSupplies } from "@api/admin/suppliersApi"
import { fetchIngredients } from "@api/admin/ingredientsApi"
import { useForm, useFieldArray } from "react-hook-form"
import { SupplierType, SupplierCreate, Supply } from "@interfaces/admin/SupplierTypes"
import { Ingredient } from "@interfaces/admin/IngredientTypes"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import styles from './SupplierForm.module.css'

interface Props {
    refetch: () => void
    initialData?: SupplierFormData 
    closeModal?: () => void       
}

export interface SupplierFormData {
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

const SupplierForm = ({ refetch, initialData, closeModal }: Props) => {
    const isEdit = !!initialData

    const createMutation = useMutation({
        mutationFn: createSupplier,
        onSuccess: async (_, variables) => {
            await updateSupplies(variables.id, getValues().supplies)
            refetch()
            reset()
            closeModal?.()
        },
        onError: () => {
            alert("Error al crear proveedor")
        }
    })

    const updateMutation = useMutation({
        mutationFn: async (data: SupplierFormData) => {
            await updateSupplier(data.ID, {
                nombre: data.name,
                ubicación: data.location,
                calificación: data.rating,
                tipo: data.type as SupplierType[]
            })
            await updateSupplies(data.ID, data.supplies)
        },
        onSuccess: () => {
            refetch()
            reset()
            closeModal?.()
        },
        onError: () => {
            alert("Error al actualizar proveedor")
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

    useEffect(() => {
        if (initialData) {
            reset(initialData)
        }
    }, [initialData, reset])

    const onSubmit = (data: SupplierFormData) => {
        if (isEdit) {
            updateMutation.mutate(data)
        } else {
            const supplier: SupplierCreate = {
                id: data.ID,
                nombre: data.name,
                ubicación: data.location,
                calificación: data.rating,
                tipo: data.type.filter((t): t is SupplierType => t === "Supplier" || t === "Distributor" || t === "Wholesaler")
            }
            createMutation.mutate(supplier)
        }
    }

    const updateSupplies = async (supplierId: string, supplies: SupplyFormData[]) => {
        const adaptedSupplies: Supply[] = supplies
            .filter(s => s.ingredientId && s.cantidad > 0 && s.fecha)
            .map(s => ({
                ingredientId: s.ingredientId,
                cantidad: s.cantidad,
                fecha: s.fecha
            }))

        await updateSupplierSupplies(supplierId, adaptedSupplies)
    }


    return (
        <form className={styles.supplierForm} onSubmit={handleSubmit(onSubmit)}>
            <input className={styles.input} type="text" placeholder="ID" {...register("ID")} disabled={isEdit} />
            <input className={styles.input} type="text" placeholder="Nombre" {...register("name")} />
            <input className={styles.input} type="text" placeholder="Ubicacion" {...register("location")} />
            <input className={styles.input} type="number" step="any" placeholder="Calificacion (1-5)" {...register("rating")} />
    
            <div className={styles.checkboxGroup}>
                <label><input type="checkbox" value="Supplier" {...register("type")} /> Supplier</label>
                <label><input type="checkbox" value="Distributor" {...register("type")} /> Distributor</label>
                <label><input type="checkbox" value="Wholesaler" {...register("type")} /> Wholesaler</label>
            </div>
    
            <h3 className={styles.sectionTitle}>Productos que provee</h3>
            {fields.map((field, index) => (
                <div className={styles.supplyRow} key={field.id}>
                    <select className={styles.select} {...register(`supplies.${index}.ingredientId` as const)}>
                        <option value="">Seleccione Ingrediente</option>
                        {ingredients.map(ingredient => (
                            <option key={ingredient.ID} value={ingredient.ID}>
                                {ingredient.name} - {ingredient.ID}
                            </option>
                        ))}
                    </select>
                    <input className={styles.input} type="number" placeholder="Cantidad" {...register(`supplies.${index}.cantidad` as const)} />
                    <input className={styles.input} type="date" placeholder="Fecha de suministro" {...register(`supplies.${index}.fecha` as const)} />
                    <button className={styles.deleteButton} type="button" onClick={() => remove(index)}>Eliminar</button>
                </div>
            ))}
    
            <button className={styles.addButton} type="button" onClick={() => append({ ingredientId: "", cantidad: 0, fecha: "" })}>
                Agregar Producto
            </button>
    
            <button className={styles.submitButton} type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {isEdit ? "Actualizar Proveedor" : "Guardar Proveedor"}
            </button>
        </form>
    )
    
}

export default SupplierForm
