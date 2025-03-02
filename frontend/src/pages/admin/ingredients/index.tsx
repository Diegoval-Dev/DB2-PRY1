import IngredientList from "@components/admin/ingredients/IngredientList"
import IngredientForm from "@components/admin/ingredients/IngredientForm"

const IngredientsPage = () => {
  return (
    <div>
      <h1>Gestion de Insumos</h1>
      <IngredientForm />
      <IngredientList />
    </div>
  )
}

export default IngredientsPage
