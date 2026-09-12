import { Router } from "express";
import { listInvestigations, getInvestigationById } from "../controllers/investigationsController";

const router = Router();

router.get("/investigations", listInvestigations);
router.get("/investigations/:id", getInvestigationById);

export default router;
