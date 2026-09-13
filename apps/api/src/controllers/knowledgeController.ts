import { Request, Response, NextFunction } from "express";
import { KnowledgeRepository } from "../repositories/knowledgeRepository";
import { sendSuccess } from "../utils/response";
import { NotFoundError } from "../errors/AppError";

export async function listKnowledge(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const type = req.query.type as string | undefined;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const docs = await KnowledgeRepository.getAll({ type, status, search });
    sendSuccess(res, docs, {
      total: docs.length,
      page: 1,
      limit: docs.length,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    });
  } catch (error) {
    next(error);
  }
}

export async function getKnowledgeById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    const doc = await KnowledgeRepository.getById(id);
    if (!doc) {
      throw new NotFoundError(`Knowledge Document with ID '${id}' was not found`);
    }
    sendSuccess(res, doc);
  } catch (error) {
    next(error);
  }
}
