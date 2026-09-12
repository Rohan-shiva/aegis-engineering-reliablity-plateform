import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env";
import healthRoutes from "./routes/healthRoutes";
import servicesRoutes from "./routes/servicesRoutes";
import incidentsRoutes from "./routes/incidentsRoutes";
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

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
