import * as yup from "yup"

export const inventorySchema = yup.object({
  ID: yup.string().required("ID es requerido"),
  location: yup.string().required("Ubicacion es requerida"),
  capacity: yup.number().min(1, "Capacidad minima es 1").required("Capacidad es requerida"),
  storedQuantity: yup.number().min(0, "Cantidad almacenada no puede ser negativa").required("Cantidad almacenada es requerida")
})
