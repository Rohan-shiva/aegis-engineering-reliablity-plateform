import { Request, Response } from "express";
import { sendSuccess } from "../utils/response";

export function getHealthStatus(_req: Request, res: Response): void {
  sendSuccess(res, {
    status: "pass",
    version: "0.1.0",
    service: "aegis-api",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
