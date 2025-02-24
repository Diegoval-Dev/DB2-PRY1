import { Router } from "express";
import { getAllSuppliers } from "../controllers/suppliers.controller";

const router = Router();

router.get("/", getAllSuppliers);

export default router;
