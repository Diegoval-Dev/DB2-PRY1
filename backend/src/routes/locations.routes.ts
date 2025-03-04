import { Router } from "express";
import { 
  getAllLocations, 
  createLocation,
  deleteLocation,
  updateLocation
} from "../controllers/location.controller";

const router = Router();

router.post("/", createLocation);
router.get("/", getAllLocations);
router.patch("/:id", updateLocation)
router.delete("/:id", deleteLocation)

export default router;
