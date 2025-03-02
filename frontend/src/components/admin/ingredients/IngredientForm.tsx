import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIngredient } from "@api/admin/ingredientsApi";
import { Ingredient } from "@interfaces/admin/IngredientTypes";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ingredientSchema } from "@validations/admin/ingredientSchema";

const IngredientForm = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      reset();
    },
    onError: () => {
      alert("Error al crear insumo");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Ingredient>({
    resolver: yupResolver(ingredientSchema),
    defaultValues: {
      ID: "",
      name: "",
      category: "",
      price: 0,
      quantity: 0,
      expirationDate: "",
    },
  });

  const onSubmit = (data: Ingredient) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="ID" {...register("ID")} />
      <p>{errors.ID?.message}</p>

      <input type="text" placeholder="Nombre" {...register("name")} />
      <p>{errors.name?.message}</p>

      <input type="text" placeholder="Categoria" {...register("category")} />
      <p>{errors.category?.message}</p>

      <input type="number" placeholder="Precio" {...register("price")} />
      <p>{errors.price?.message}</p>

      <input type="number" placeholder="Cantidad" {...register("quantity")} />
      <p>{errors.quantity?.message}</p>

      <input
        type="date"
        placeholder="Fecha de caducidad"
        {...register("expirationDate")}
      />
      <p>{errors.expirationDate?.message}</p>

      <button type="submit" disabled={mutation.isPending}>
        Guardar Insumo
      </button>
    </form>
  );
};

export default IngredientForm;
