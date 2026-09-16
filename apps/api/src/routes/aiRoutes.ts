import { Router } from "express";
import { AiController } from "../controllers/aiController";

const router = Router();

router.post("/investigate", AiController.triggerInvestigation);
router.get("/investigations", AiController.listInvestigations);
router.get("/investigations/:id", AiController.getInvestigationById);

export default router;
