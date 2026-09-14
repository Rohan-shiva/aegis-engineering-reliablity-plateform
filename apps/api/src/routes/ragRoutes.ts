import { Router } from "express";
import { ingestDocument, searchVectors } from "../controllers/ragController";

const router = Router();

router.post("/rag/ingest", ingestDocument);
router.post("/rag/search", searchVectors);

export default router;
