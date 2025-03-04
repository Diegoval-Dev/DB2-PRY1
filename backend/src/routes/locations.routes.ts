import { Router } from "express";
import { getAllLocations, createLocation } from "../controllers/location.controller";

const router = Router();

router.post("/", createLocation);
router.get("/", getAllLocations);

export default router;
