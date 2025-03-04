import { Router } from "express"
import { createCategory, getAllCategories, deleteCategory } from "../controllers/categories.controller"

const router = Router()

router.post("/", createCategory)
router.get("/", getAllCategories)
router.delete("/:id", deleteCategory)

export default router
