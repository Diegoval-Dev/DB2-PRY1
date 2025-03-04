import { Router } from "express";
import multer from "multer";
import { getAllIngredients, getIngredientById, createIngredient, updateIngredient, deleteIngredient, bulkLoadIngredients } from "../controllers/ingredients.controller";
const router = Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getAllIngredients);
router.get("/:id", getIngredientById);
router.post("/", createIngredient);
router.put("/:id", updateIngredient);
router.delete("/:id", deleteIngredient);
router.post("/bulk", upload.single("file"), bulkLoadIngredients);



export default router;
