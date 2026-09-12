import { Router } from "express";
import { listKnowledge, getKnowledgeById } from "../controllers/knowledgeController";

const router = Router();

router.get("/knowledge", listKnowledge);
router.get("/knowledge/:id", getKnowledgeById);

export default router;
