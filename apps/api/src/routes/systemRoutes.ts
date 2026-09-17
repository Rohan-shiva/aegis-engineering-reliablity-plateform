import { Router } from "express";
import { SystemController } from "../controllers/systemController";

const router = Router();

router.get("/system/status", SystemController.getSystemStatus);
router.post("/system/benchmark", SystemController.runBenchmark);

export default router;
