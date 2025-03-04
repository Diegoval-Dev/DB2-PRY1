import { useMutation, useQuery } from "@tanstack/react-query"
import { updateSupplierSupplies } from "@api/admin/suppliersApi"
import { fetchIngredients } from "@api/admin/ingredientsApi"
import { useForm, useFieldArray } from "react-hook-form"
import { Supply } from "@interfaces/admin/SupplierTypes"
import { Ingredient } from "@interfaces/admin/IngredientTypes"
import { useEffect } from "react"
import styles from './SupplierSuppliesForm.module.css'

interface Props {
    supplierId: string
    initialSupplies: Supply[]
    closeModal: () => void
    refetch: () => void
}

interface SuppliesFormData {
    supplies: Supply[]
}

const SupplierSuppliesForm = ({ supplierId, initialSupplies, closeModal, refetch }: Props) => {
    const { data: ingredients = [] } = useQuery<Ingredient[]>({
        queryKey: ["ingredients"],
        queryFn: fetchIngredients
    })

    const mutation = useMutation({
        mutationFn: (supplies: Supply[]) => updateSupplierSupplies(supplierId, supplies),
        onSuccess: () => {
            refetch()
            closeModal()
        },
        onError: () => {
            alert("Error actualizando suministros")
        }
    })

    const { control, register, handleSubmit, reset } = useForm<SuppliesFormData>({
        defaultValues: { supplies: initialSupplies }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "supplies"
    })

    useEffect(() => {
        reset({ supplies: initialSupplies })
    }, [initialSupplies, reset])

    const onSubmit = (data: SuppliesFormData) => {
        mutation.mutate(data.supplies)
    }


    return (
        <form className={styles.suppliesForm} onSubmit={handleSubmit(onSubmit)}>
            <h3 className={styles.sectionTitle}>Productos que suministra</h3>
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
                    <input
                        className={styles.input}
                        type="number"
                        placeholder="Cantidad"
                        {...register(`supplies.${index}.cantidad` as const)}
                    />
                    <input
                        className={styles.input}
                        type="date"
                        placeholder="Fecha"
                        {...register(`supplies.${index}.fecha` as const)}
                    />
                    <button
                        className={styles.deleteButton}
                        type="button"
                        onClick={() => remove(index)}
                    >
                        Eliminar
                    </button>
                </div>
            ))}
            <button
                className={styles.addButton}
                type="button"
                onClick={() => append({ ingredientId: "", cantidad: 0, fecha: "" })}
            >
                Agregar Producto
            </button>
            <button className={styles.submitButton} type="submit">
                Guardar Suministros
            </button>
        </form>
    )
    
}

export default SupplierSuppliesForm
