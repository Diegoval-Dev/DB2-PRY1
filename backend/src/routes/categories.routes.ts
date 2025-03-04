import { Router } from "express"
import { 
  createCategory, 
  getAllCategories, 
  deleteCategory,
  updateCategory
} from "../controllers/categories.controller"

const router = Router()

router.post("/", createCategory)
router.get("/", getAllCategories)
router.patch("/:id", updateCategory)
router.delete("/:id", deleteCategory)

export default router
