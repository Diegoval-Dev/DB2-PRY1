import * as yup from "yup"

export const ingredientSchema = yup.object({
  ID: yup.string().required("ID es requerido"),
  name: yup.string().required("Nombre es requerido"),
  category: yup.string().required("Categoria es requerida"),
  price: yup.number().min(0, "El precio no puede ser negativo").required("Precio es requerido"),
  quantity: yup.number().min(0, "La cantidad no puede ser negativa").required("Cantidad es requerida"),
  expirationDate: yup.string().required("Fecha de caducidad es requerida"),
  type: yup.array().of(yup.string()).required("Tipo es requerido")
})
