import { Router } from "express";
import { getAllInventories, getInventoryById, createInventory, updateInventory, deleteInventory } from "../controllers/inventory.controller";

const router = Router();

router.get("/", getAllInventories);
router.get("/:id", getInventoryById);
router.post("/", createInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

export default router;
