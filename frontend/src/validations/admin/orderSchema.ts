import * as yup from "yup"

export const orderSchema = yup.object({
  ID: yup.string().required("ID es requerido"),
  orderDate: yup.string().required("Fecha de orden es requerida"),
  quantity: yup.number().min(1, "Cantidad minima es 1").required("Cantidad es requerida"),
  status: yup.string().oneOf(["pendiente", "enviada", "completada"], "Estado no valido").required("Estado es requerido"),
  totalCost: yup.number().positive("Costo total debe ser positivo").required("Costo total es requerido")
})
