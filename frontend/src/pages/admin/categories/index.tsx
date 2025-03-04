import { useQuery } from "@tanstack/react-query"
import { fetchCategories } from "@api/admin/categoriesApi"
import { useState } from "react"
import CategoryForm from "@components/admin/categories/CategoryForm"
import CategoryList from "@components/admin/categories/CategoryList"
import { Category } from "@interfaces/admin/CategoryTypes"

const CategoriesPage = () => {
    const { data = [], isLoading, error, refetch } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories
    })

    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    return (
        <div>
            <h1>Gestión de Categorías</h1>
            <CategoryForm refetch={refetch} initialData={editingCategory} closeModal={() => setEditingCategory(null)} />
            <CategoryList
                categories={data}
                isLoading={isLoading}
                error={error}
                refetch={refetch}
                onEdit={(category) => setEditingCategory(category)}
            />
        </div>
    )
}

export default CategoriesPage
