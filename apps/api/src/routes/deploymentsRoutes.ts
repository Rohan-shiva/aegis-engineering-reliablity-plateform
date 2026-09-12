import { Router } from "express";
import { listDeployments, getDeploymentById } from "../controllers/deploymentsController";

const router = Router();

router.get("/deployments", listDeployments);
router.get("/deployments/:id", getDeploymentById);

export default router;
