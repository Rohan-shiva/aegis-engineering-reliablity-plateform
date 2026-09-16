import { Router } from "express";
import { RemediationController } from "../controllers/remediationController";

const router = Router();

router.get("/remediation/actions", RemediationController.listActions);
router.post("/remediation/actions", RemediationController.createAction);
router.post("/remediation/actions/:id/approve", RemediationController.approveAction);
router.post("/remediation/actions/:id/reject", RemediationController.rejectAction);
router.post("/remediation/actions/:id/execute", RemediationController.executeAction);

export default router;
