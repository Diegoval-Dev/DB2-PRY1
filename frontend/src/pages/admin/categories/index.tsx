import { useQuery } from "@tanstack/react-query"
import { fetchCategories } from "@api/admin/categoriesApi"
import CategoryForm from "@components/admin/categories/CategoryForm"
import CategoryList from "@components/admin/categories/CategoryList"

const CategoriesPage = () => {
    const { data: categories = [], refetch } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories
    })

    return (
        <div>
            <h1>Gestión de Categorías</h1>
            <CategoryForm refetch={refetch} />
            <CategoryList categories={categories} refetch={refetch} />
        </div>
    )
}

export default CategoriesPage
