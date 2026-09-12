import { Response } from "express";
import { ApiResponse, ApiErrorResponse, PaginationMeta } from "@aegis/types";

export function sendSuccess<T>(res: Response, data: T, meta?: PaginationMeta, statusCode = 200): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(meta && { meta }),
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  code = "INTERNAL_SERVER_ERROR",
  details?: unknown
): void {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined && { details }),
    },
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}
