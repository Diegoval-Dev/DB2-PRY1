import * as yup from "yup"

export const ingredientSchema = yup.object({
  ID: yup.string().required("ID es requerido"),
  name: yup.string().required("Nombre es requerido"),
  category: yup.string().required("Categoria es requerida"),
  price: yup.number().positive("Precio debe ser positivo").required("Precio es requerido"),
  quantity: yup.number().min(1, "Cantidad minima es 1").required("Cantidad es requerida"),
  expirationDate: yup.string().required("Fecha de caducidad es requerida")
})
