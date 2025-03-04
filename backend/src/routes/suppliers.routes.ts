import { Router } from "express";
import { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier, updateSupplies } from "../controllers/suppliers.controller";

const router = Router();

router.get("/", getAllSuppliers);
router.get("/:id", getSupplierById);
router.post("/", createSupplier);
router.put("/:id", updateSupplier);
router.put("/:id/supplies", updateSupplies);
router.delete("/:id", deleteSupplier);

export default router;
