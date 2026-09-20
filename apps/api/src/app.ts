import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env";
import healthRoutes from "./routes/healthRoutes";
import servicesRoutes from "./routes/servicesRoutes";
import incidentsRoutes from "./routes/incidentsRoutes";
import deploymentsRoutes from "./routes/deploymentsRoutes";
import knowledgeRoutes from "./routes/knowledgeRoutes";
import investigationsRoutes from "./routes/investigationsRoutes";
import ragRoutes from "./routes/ragRoutes";
import aiRoutes from "./routes/aiRoutes";
import remediationRoutes from "./routes/remediationRoutes";
import systemRoutes from "./routes/systemRoutes";
import docsRoutes from "./routes/docsRoutes";
import { errorHandler } from "./middlewares/errorHandler";

export function createApp(): Express {
  const app = express();

  // Core Security & Utility Middlewares
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());
  app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));

  // API v1 Routes
  const apiPrefix = `/api/${config.apiVersion}`;
  app.use(apiPrefix, healthRoutes);
  app.use(apiPrefix, servicesRoutes);
  app.use(apiPrefix, incidentsRoutes);
  app.use(apiPrefix, deploymentsRoutes);
  app.use(apiPrefix, knowledgeRoutes);
  app.use(apiPrefix, investigationsRoutes);
  app.use(apiPrefix, ragRoutes);
  app.use(apiPrefix, aiRoutes);
  app.use(apiPrefix, remediationRoutes);
  app.use(apiPrefix, systemRoutes);
  app.use(apiPrefix, docsRoutes);

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
