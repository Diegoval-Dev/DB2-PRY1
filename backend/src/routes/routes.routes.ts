import { Router } from "express";
import { getAllRoutes, createRoute, updateRoute, deleteRoute } from "../controllers/routes.controller";

const router = Router();

router.get("/", getAllRoutes);
router.post("/", createRoute);
router.put("/:id", updateRoute);
router.delete("/:id", deleteRoute);

export default router;
