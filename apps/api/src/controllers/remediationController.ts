import { Request, Response } from "express";
import { RemediationEngine } from "../remediation/remediationEngine";

export class RemediationController {
  public static async listActions(req: Request, res: Response): Promise<void> {
    try {
      const { incidentId, status } = req.query;
      const actions = await RemediationEngine.listActions({
        incidentId: incidentId ? String(incidentId) : undefined,
        status: status ? String(status) : undefined,
      });

      res.status(200).json({
        success: true,
        data: actions,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        success: false,
        error: "Failed to fetch remediation actions",
        details: msg,
      });
    }
  }

  public static async createAction(req: Request, res: Response): Promise<void> {
    try {
      const { incidentId, serviceName, actionType, targetVersion } = req.body || {};

      if (!incidentId || !serviceName || !actionType) {
        res.status(400).json({
          success: false,
          error: "Missing required fields: incidentId, serviceName, actionType",
        });
        return;
      }

      const action = await RemediationEngine.createAction({
        incidentId,
        serviceName,
        actionType,
        targetVersion,
      });

      res.status(201).json({
        success: true,
        data: action,
        message: "Remediation action created successfully.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        success: false,
        error: "Failed to create remediation action",
        details: msg,
      });
    }
  }

  public static async approveAction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { engineerName } = req.body || {};

      const action = await RemediationEngine.approveAction(id, engineerName);

      res.status(200).json({
        success: true,
        data: action,
        message: `Action '${id}' approved successfully by ${action.approvedBy}.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(400).json({
        success: false,
        error: "Approval failed",
        details: msg,
      });
    }
  }

  public static async rejectAction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body || {};

      const action = await RemediationEngine.rejectAction(id, reason);

      res.status(200).json({
        success: true,
        data: action,
        message: `Action '${id}' rejected successfully.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(400).json({
        success: false,
        error: "Rejection failed",
        details: msg,
      });
    }
  }

  public static async executeAction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const action = await RemediationEngine.executeAction(id);

      res.status(200).json({
        success: true,
        data: action,
        message: `Remediation playbook for action '${id}' executed successfully.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(400).json({
        success: false,
        error: "Execution failed / Safety Guardrail Violation",
        details: msg,
      });
    }
  }
}
