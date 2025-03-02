import { useQuery } from "@tanstack/react-query";
import { fetchIngredients } from "@api/admin/ingredientsApi";
import { Ingredient } from "@interfaces/admin/IngredientTypes";

const IngredientList = () => {
  const {
    data: ingredients = [],
    isLoading,
    error,
  } = useQuery<Ingredient[]>({
    queryKey: ["ingredients"],
    queryFn: fetchIngredients,
  });

  if (isLoading) return <p>Cargando insumos...</p>;
  if (error) return <p>Error cargando insumos.</p>;

  return (
    <ul>
      {ingredients.map((ingredient) => (
        <li key={ingredient.ID}>
          {ingredient.name} - {ingredient.category} (Cantidad:{" "}
          {ingredient.quantity}) - Expira: {ingredient.expirationDate}
        </li>
      ))}
    </ul>
  );
};

export default IngredientList;
