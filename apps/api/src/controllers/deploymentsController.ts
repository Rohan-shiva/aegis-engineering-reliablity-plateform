import { Request, Response, NextFunction } from "express";
import { DeploymentsRepository } from "../repositories/deploymentsRepository";
import { sendSuccess } from "../utils/response";
import { NotFoundError } from "../errors/AppError";

export function listDeployments(req: Request, res: Response, next: NextFunction): void {
  try {
    const environment = req.query.environment as string | undefined;
    const status = req.query.status as string | undefined;
    const minRiskStr = req.query.minRiskScore as string | undefined;
    const minRiskScore = minRiskStr ? parseInt(minRiskStr, 10) : undefined;

    const deployments = DeploymentsRepository.getAll({ environment, status, minRiskScore });
    sendSuccess(res, deployments, {
      total: deployments.length,
      page: 1,
      limit: deployments.length,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    });
  } catch (error) {
    next(error);
  }
}

export function getDeploymentById(req: Request, res: Response, next: NextFunction): void {
  try {
    const id = req.params.id;
    const deployment = DeploymentsRepository.getById(id);
    if (!deployment) {
      throw new NotFoundError(`Deployment with ID or Commit SHA '${id}' was not found`);
    }
    sendSuccess(res, deployment);
  } catch (error) {
    next(error);
  }
}
