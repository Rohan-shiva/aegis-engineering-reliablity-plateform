import { Router } from "express";
import { listIncidents, getIncidentById } from "../controllers/incidentsController";

const router = Router();

router.get("/incidents", listIncidents);
router.get("/incidents/:id", getIncidentById);

export default router;
