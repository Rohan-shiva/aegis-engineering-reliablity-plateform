import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env";

export function createApp(): Express {
  const app = express();

  // Core Security & Utility Middlewares
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());
  app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));

  return app;
}
