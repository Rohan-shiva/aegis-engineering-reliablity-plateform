import { Router } from "express";
import { listServices, getServiceById } from "../controllers/servicesController";

const router = Router();

router.get("/services", listServices);
router.get("/services/:id", getServiceById);

export default router;
