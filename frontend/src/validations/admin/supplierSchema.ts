import * as yup from "yup"

export const supplierSchema = yup.object({
  ID: yup.string().required("ID es requerido"),
  name: yup.string().required("Nombre es requerido"),
  location: yup.string().required("Ubicacion es requerida"),
  rating: yup.number().min(1, "Calificacion minima es 1").max(5, "Calificacion maxima es 5").required("Calificacion es requerida")
})
