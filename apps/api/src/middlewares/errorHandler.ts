import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { sendError } from "../utils/response";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.code, err.details);
    return;
  }

  console.error("[Unhandled API Error]:", err);
  sendError(res, "An unexpected internal server error occurred", 500, "INTERNAL_SERVER_ERROR");
}
