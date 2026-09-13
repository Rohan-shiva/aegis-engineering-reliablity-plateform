import { Request, Response, NextFunction } from "express";
import { InvestigationsRepository } from "../repositories/investigationsRepository";
import { sendSuccess } from "../utils/response";
import { NotFoundError } from "../errors/AppError";

export async function listInvestigations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const items = await InvestigationsRepository.getAll({ status, search });
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

export async function getInvestigationById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    const inv = await InvestigationsRepository.getById(id);
    if (!inv) {
      throw new NotFoundError(`AI Investigation with ID '${id}' was not found`);
    }
    sendSuccess(res, inv);
  } catch (error) {
    next(error);
  }
}
