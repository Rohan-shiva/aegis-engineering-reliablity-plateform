import { Request, Response, NextFunction } from "express";
import { IncidentsRepository } from "../repositories/incidentsRepository";
import { sendSuccess } from "../utils/response";
import { NotFoundError } from "../errors/AppError";

export function listIncidents(req: Request, res: Response, next: NextFunction): void {
  try {
    const severity = req.query.severity as string | undefined;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const incidents = IncidentsRepository.getAll({ severity, status, search });
    sendSuccess(res, incidents, {
      total: incidents.length,
      page: 1,
      limit: incidents.length,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    });
  } catch (error) {
    next(error);
  }
}

export function getIncidentById(req: Request, res: Response, next: NextFunction): void {
  try {
    const id = req.params.id;
    const incident = IncidentsRepository.getById(id);
    if (!incident) {
      throw new NotFoundError(`Incident with ID or Code '${id}' was not found`);
    }
    sendSuccess(res, incident);
  } catch (error) {
    next(error);
  }
}
