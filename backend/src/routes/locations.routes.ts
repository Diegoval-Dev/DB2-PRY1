import { Router } from "express";
import { createLocation, getAllLocations } from "../controllers/location.controller";

const router = Router();

router.post("/", createLocation);
router.get("/", getAllLocations);

export default router;
