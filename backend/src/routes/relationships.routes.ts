import { Router } from "express";
import {
    createSuppliesRelation,
    createStoredInRelation,
    createLocatedInRelation,
    createConnectsRelation,
    createBelongsToRelation,
    createPartnersWithRelation
} from "../controllers/relationships.controller";

const router = Router();

router.post("/supplies", createSuppliesRelation);
router.post("/stored-in", createStoredInRelation);
router.post("/located-in", createLocatedInRelation);
router.post("/connects", createConnectsRelation);
router.post("/belongs-to", createBelongsToRelation);
router.post("/partners-with", createPartnersWithRelation);

export default router;
