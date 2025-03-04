import { useMutation, useQuery } from "@tanstack/react-query"
import { createIngredient, updateIngredient, updateIngredientStorages } from "@api/admin/ingredientsApi"
import { fetchInventories } from "@api/admin/inventoryApi"
import { fetchCategories } from "@api/admin/categoriesApi"
import { useForm, useFieldArray } from "react-hook-form"
import { StorageRequest } from "@interfaces/admin/IngredientTypes"
import { useEffect } from "react"
import styles from './IngredientForm.module.css'

interface Props {
    refetch: () => void
    initialData?: IngredientFormData
    closeModal?: () => void
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

const IngredientForm = ({ refetch, initialData, closeModal }: Props) => {
    const isEdit = !!initialData

    const createMutation = useMutation({
        mutationFn: createIngredient,
        onSuccess: () => {
            refetch()
            reset()
            closeModal?.()
        },
        onError: () => alert("Error al guardar insumo")
    })

    const updateMutation = useMutation({
        mutationFn: async (data: IngredientFormData) => {
            await updateIngredient(data.ID, {
                nombre: data.name,
                precio: data.price,
                fechaCaducidad: data.expirationDate,
                tipo: data.type,
                categoryId: data.categoryId
            })
            await updateIngredientStorages(data.ID, data.storages)
        },
        onSuccess: () => {
            refetch()
            reset()
            closeModal?.()
        },
        onError: () => alert("Error al actualizar insumo")
    })

    const { data: inventories = [] } = useQuery({ queryKey: ["inventories"], queryFn: fetchInventories })
    const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories })

    const { register, handleSubmit, reset, control } = useForm<IngredientFormData>({
        defaultValues: initialData || {
            ID: "",
            name: "",
            price: 0,
            expirationDate: "",
            type: [],
            categoryId: "",
            storages: [{ inventoryId: "", cantidad: 0 }]
        }
    })

    const { fields, append, remove } = useFieldArray({ control, name: "storages" })

    useEffect(() => { if (initialData) reset(initialData) }, [initialData, reset])

    const onSubmit = (data: IngredientFormData) => {
        if (isEdit) updateMutation.mutate(data)
        else createMutation.mutate({
            id: data.ID,
            nombre: data.name,
            precio: data.price,
            fechaCaducidad: data.expirationDate,
            tipo: data.type,
            categoryId: data.categoryId,
            storages: data.storages,
            categoría: ""
        })
    }


    return (
        <form className={styles.ingredientForm} onSubmit={handleSubmit(onSubmit)}>
            <input className={styles.input} placeholder="ID" {...register("ID")} disabled={isEdit} />
            <input className={styles.input} placeholder="Nombre" {...register("name")} />
            <input className={styles.input} type="number" step="any" placeholder="Precio" {...register("price")} />
            <input className={styles.input} type="date" placeholder="Fecha de Caducidad" {...register("expirationDate")} />
    
            <div className={styles.checkboxGroup}>
                <label><input type="checkbox" value="Ingredient" {...register("type")} /> Ingredient</label>
                <label><input type="checkbox" value="Perishable" {...register("type")} /> Perishable</label>
                <label><input type="checkbox" value="Organic" {...register("type")} /> Organic</label>
            </div>
    
            <select className={styles.select} {...register("categoryId")}>
                <option value="">Seleccione Categoria</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
    
            <h3 className={styles.sectionTitle}>Almacenamiento</h3>
            {fields.map((field, index) => (
                <div key={field.id} className={styles.storageRow}>
                    <select className={styles.select} {...register(`storages.${index}.inventoryId`)}>
                        {inventories.map(i => <option key={i.ID} value={i.ID}>{i.ID} - {i.location}</option>)}
                    </select>
                    <input className={styles.input} type="number" {...register(`storages.${index}.cantidad`)} />
                    <button className={styles.deleteButton} type="button" onClick={() => remove(index)}>Eliminar</button>
                </div>
            ))}
            <button className={styles.addButton} type="button" onClick={() => append({ inventoryId: "", cantidad: 0 })}>
                Agregar Almacenamiento
            </button>
            <button className={styles.submitButton} type="submit">
                {isEdit ? "Actualizar Insumo" : "Crear Insumo"}
            </button>
        </form>
    )
    
}

export default IngredientForm
