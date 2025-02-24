import { Router } from "express";
import { getAllIngredients, getIngredientById, createIngredient, updateIngredient, deleteIngredient } from "../controllers/ingredients.controller";

const router = Router();

router.get("/", getAllIngredients);
router.get("/:id", getIngredientById);
router.post("/", createIngredient);
router.put("/:id", updateIngredient);
router.delete("/:id", deleteIngredient);

export default router;
