import * as yup from "yup"


export const inventorySchema = yup.object().shape({
  ID: yup.string().required("ID is required"),
  location: yup.string().required("Location is required"),
  capacity: yup.number().required("Capacity is required"),
  supplyQuantity: yup.number().required("Supply Quantity is required"),
  storedQuantity: yup.number().required("Stored Quantity is required"),
  type: yup.array().of(yup.string().oneOf(["Inventory", "ColdStorage", "DryStorage"])).required("Type is required")
})