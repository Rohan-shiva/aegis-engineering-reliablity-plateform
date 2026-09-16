import { Request, Response } from "express";
import { ReActEngine } from "../ai/reactEngine";
import { InvestigationsRepository } from "../repositories/investigationsRepository";

export class AiController {
  public static async triggerInvestigation(req: Request, res: Response): Promise<void> {
    try {
      const { targetIncidentCode, targetServiceName, title } = req.body || {};

      const investigation = await ReActEngine.runInvestigation({
        targetIncidentCode,
        targetServiceName,
        title,
      });

      await InvestigationsRepository.save(investigation);

      res.status(201).json({
        success: true,
        data: investigation,
        message: "AI ReAct Incident Investigation executed successfully.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        success: false,
        error: "Failed to execute AI investigation",
        details: msg,
      });
    }
  }

  public static async listInvestigations(req: Request, res: Response): Promise<void> {
    try {
      const { status, search } = req.query;
      const investigations = await InvestigationsRepository.getAll({
        status: status ? String(status) : undefined,
        search: search ? String(search) : undefined,
      });

      res.status(200).json({
        success: true,
        data: investigations,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        success: false,
        error: "Failed to fetch investigations",
        details: msg,
      });
    }
  }

  public static async getInvestigationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const investigation = await InvestigationsRepository.getById(id);

      if (!investigation) {
        res.status(404).json({
          success: false,
          error: `Investigation '${id}' not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: investigation,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        success: false,
        error: "Failed to fetch investigation detail",
        details: msg,
      });
    }
  }
}
