import { Router } from "express";
import { 
  getAllSuppliers, 
  getSupplierById, 
  createSupplier, 
  updateSupplier, 
  deleteSupplier, 
  updateSupplies,
  updateSupplierProperty,
  getSupplierSupplies,
  deleteMultipleSuppliers
} from "../controllers/suppliers.controller";

const router = Router();

router.get("/", getAllSuppliers);
router.get("/:id", getSupplierById);
router.post("/", createSupplier);
router.put("/:id", updateSupplier);
router.put("/:id/supplies", updateSupplies);
router.delete("/:id", deleteSupplier);
router.patch("/:id", updateSupplierProperty)
router.get("/:id/supplies", getSupplierSupplies)
router.post("/bulk-delete", deleteMultipleSuppliers)

export default router;
