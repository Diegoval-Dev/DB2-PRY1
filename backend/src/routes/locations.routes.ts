import { Router } from "express";
import { createRoute, getAllRoutes } from "../controllers/routes.controller";

const router = Router();

router.post("/", createRoute);
router.get("/", getAllRoutes);

export default router;
