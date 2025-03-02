import { Ingredient } from "@interfaces/admin/IngredientTypes"

interface Props {
  ingredients: Ingredient[]
  isLoading: boolean
  error: unknown
}

const IngredientList = ({ ingredients, isLoading, error }: Props) => {
  if (isLoading) return <p>Cargando ingredientes...</p>
  if (error) return <p>Error cargando ingredientes.</p>

  return (
    <ul>
      {ingredients.map(ingredient => (
        <li key={ingredient.ID}>
          {ingredient.name} - {ingredient.category} - Q{ingredient.price} ({ingredient.quantity} en existencia) - Tipos: {ingredient.type.join(", ")}
        </li>
      ))}
    </ul>
  )
}

export default IngredientList
