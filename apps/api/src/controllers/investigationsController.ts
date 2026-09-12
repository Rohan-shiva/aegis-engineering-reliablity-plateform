import { Request, Response, NextFunction } from "express";
import { InvestigationsRepository } from "../repositories/investigationsRepository";
import { sendSuccess } from "../utils/response";
import { NotFoundError } from "../errors/AppError";

export function listInvestigations(req: Request, res: Response, next: NextFunction): void {
  try {
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const items = InvestigationsRepository.getAll({ status, search });
    sendSuccess(res, items, {
      total: items.length,
      page: 1,
      limit: items.length,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    });
  } catch (error) {
    next(error);
  }
}

export function getInvestigationById(req: Request, res: Response, next: NextFunction): void {
  try {
    const id = req.params.id;
    const inv = InvestigationsRepository.getById(id);
    if (!inv) {
      throw new NotFoundError(`AI Investigation with ID '${id}' was not found`);
    }
    sendSuccess(res, inv);
  } catch (error) {
    next(error);
  }
}
