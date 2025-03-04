import e, { Router } from "express";
import { getAllRestaurants } from "../controllers/location.controller";

const router = Router();

router.get("/", getAllRestaurants);

export default router;