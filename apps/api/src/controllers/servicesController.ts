import { Request, Response, NextFunction } from "express";
import { ServicesRepository } from "../repositories/servicesRepository";
import { sendSuccess } from "../utils/response";
import { NotFoundError } from "../errors/AppError";

export async function listServices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const services = await ServicesRepository.getAll({ status, search });
    sendSuccess(res, services, {
      total: services.length,
      page: 1,
      limit: services.length,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    });
  } catch (error) {
    next(error);
  }
}

export async function getServiceById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    const service = await ServicesRepository.getById(id);
    if (!service) {
      throw new NotFoundError(`Service with ID or name '${id}' was not found`);
    }
    sendSuccess(res, service);
  } catch (error) {
    next(error);
  }
}
