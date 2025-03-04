import IngredientList from "@components/admin/ingredients/IngredientList"
import IngredientForm from "@components/admin/ingredients/IngredientForm"
import { useQuery } from "@tanstack/react-query"
import { fetchIngredients } from "@api/admin/ingredientsApi"
import { Ingredient } from "@interfaces/admin/IngredientTypes"
import BulkIngredientUpload from "@components/admin/ingredients/BulkIngredientUpload"
import { useState } from "react"

const IngredientsPage = () => {
  const { data = [], refetch } = useQuery({ queryKey: ["ingredients"], queryFn: fetchIngredients })
  const [editing, setEditing] = useState<Ingredient | null>(null)
  return (
    <div>
      <h1>Gestion de Insumos</h1>
      <IngredientForm refetch={refetch} initialData={editing} closeModal={() => setEditing(null)} />
      <BulkIngredientUpload refetch={refetch} />
      <IngredientList ingredients={data} onEdit={setEditing} refetch={refetch} isLoading={false} error={null} />
    </div>
  )
}

export default IngredientsPage
