import IngredientList from "@components/admin/ingredients/IngredientList"
import IngredientForm from "@components/admin/ingredients/IngredientForm"
import { useQuery } from "@tanstack/react-query"
import { fetchIngredients } from "@api/admin/ingredientsApi"
import { Ingredient } from "@interfaces/admin/IngredientTypes"
import BulkIngredientUpload from "@components/admin/ingredients/BulkIngredientUpload"

const IngredientsPage = () => {
  const { data: ingredients = [], isLoading, error, refetch } = useQuery<Ingredient[]>({
    queryKey: ["ingredients"],
    queryFn: fetchIngredients
  })

  return (
    <div>
      <h1>Gestion de Insumos</h1>
      <IngredientForm refetch={refetch} />
      <BulkIngredientUpload refetch={refetch} />
      <IngredientList ingredients={ingredients} isLoading={isLoading} error={error} />
    </div>
  )
}

export default IngredientsPage
