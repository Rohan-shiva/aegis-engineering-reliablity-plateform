import { RemediationAction, RemediationActionType } from "@aegis/types";
import { RemediationRegistry } from "./remediationRegistry";

const INITIAL_REMEDIATION_ACTIONS: RemediationAction[] = [
  {
    id: "act-101",
    incidentId: "INC-8492",
    serviceName: "payment-checkout-svc",
    actionType: "rollback_deployment",
    status: "pending_approval",
    title: "Rollback payment-checkout-svc deployment commit 8a4f912c",
    description: "Reverts deployment 8a4f912c to previous stable commit 7b19a04f to mitigate Postgres pool exhaustion.",
    riskLevel: "HIGH",
    requiresHumanApproval: true,
    targetVersion: "7b19a04f",
    logs: [
      "[SYSTEM] Remediation action queued by AI Investigator (Confidence: 89%).",
      "[GUARDRAIL] High Risk action flagged. Human-in-the-loop approval required.",
    ],
  },
  {
    id: "act-102",
    incidentId: "INC-8092",
    serviceName: "auth-identity-svc",
    actionType: "scale_service",
    status: "approved",
    title: "Scale auth-identity-svc container replicas to 8",
    description: "Scales Kubernetes HPA worker pods to handle JWT token validation surge.",
    riskLevel: "MEDIUM",
    requiresHumanApproval: false,
    targetVersion: "v1.4.2",
    approvedBy: "Auto-Approved Policy",
    approvedAt: new Date().toISOString(),
    logs: [
      "[SYSTEM] Remediation action queued by Telemetry Auto-scaler.",
      "[GUARDRAIL] Medium Risk action matched auto-approval policy.",
    ],
  },
];

export class RemediationEngine {
  private static actions: RemediationAction[] = [...INITIAL_REMEDIATION_ACTIONS];

  public static async listActions(filters?: { incidentId?: string; status?: string }): Promise<RemediationAction[]> {
    let result = [...this.actions];
    if (filters?.incidentId) {
      result = result.filter(
        (a) => a.incidentId.toLowerCase() === filters.incidentId?.toLowerCase()
      );
    }
    if (filters?.status) {
      result = result.filter((a) => a.status === filters.status);
    }
    return result;
  }

  public static async getActionById(id: string): Promise<RemediationAction | undefined> {
    return this.actions.find((a) => a.id === id);
  }

  public static async createAction(params: {
    incidentId: string;
    serviceName: string;
    actionType: RemediationActionType;
    targetVersion?: string;
  }): Promise<RemediationAction> {
    const playbook = RemediationRegistry.getPlaybook(params.actionType);
    const riskLevel = playbook ? playbook.defaultRiskLevel : "MEDIUM";
    const requiresHumanApproval = playbook ? playbook.requiresApprovalByDefault : true;

    const action: RemediationAction = {
      id: `act-${Date.now()}`,
      incidentId: params.incidentId,
      serviceName: params.serviceName,
      actionType: params.actionType,
      status: requiresHumanApproval ? "pending_approval" : "approved",
      title: playbook ? playbook.title : `Execute ${params.actionType} on ${params.serviceName}`,
      description: playbook ? playbook.description : `Remediation action for incident ${params.incidentId}`,
      riskLevel,
      requiresHumanApproval,
      targetVersion: params.targetVersion,
      approvedBy: requiresHumanApproval ? undefined : "Auto-Approved Policy",
      approvedAt: requiresHumanApproval ? undefined : new Date().toISOString(),
      logs: [
        `[SYSTEM] Action created for incident '${params.incidentId}' on service '${params.serviceName}'.`,
        requiresHumanApproval
          ? `[GUARDRAIL] ${riskLevel} Risk action flagged. Pending engineer approval.`
          : `[GUARDRAIL] Low/Medium risk policy matched. Auto-approved for execution.`,
      ],
    };

    this.actions.unshift(action);
    return action;
  }

  public static async approveAction(id: string, engineerName = "Lead SRE Engineer"): Promise<RemediationAction> {
    const action = await this.getActionById(id);
    if (!action) throw new Error(`Remediation action '${id}' not found.`);

    if (action.status !== "pending_approval") {
      throw new Error(`Action '${id}' is in status '${action.status}' and cannot be approved.`);
    }

    action.status = "approved";
    action.approvedBy = engineerName;
    action.approvedAt = new Date().toISOString();
    action.logs.push(`[APPROVAL] Action authorized by ${engineerName} at ${action.approvedAt}.`);

    return action;
  }

  public static async rejectAction(id: string, reason = "Engineer manually rejected action"): Promise<RemediationAction> {
    const action = await this.getActionById(id);
    if (!action) throw new Error(`Remediation action '${id}' not found.`);

    action.status = "rejected";
    action.logs.push(`[REJECTED] Action cancelled: ${reason}.`);

    return action;
  }

  public static async executeAction(id: string): Promise<RemediationAction> {
    const action = await this.getActionById(id);
    if (!action) throw new Error(`Remediation action '${id}' not found.`);

    // Safety Guardrail Check
    if (action.status !== "approved") {
      throw new Error(
        `Safety Guardrail Violation: Action '${id}' cannot execute in state '${action.status}'. Engineer approval required.`
      );
    }

    const playbook = RemediationRegistry.getPlaybook(action.actionType);
    if (!playbook) {
      action.status = "failed";
      action.logs.push(`[FATAL] No registered playbook handler for action type '${action.actionType}'.`);
      throw new Error(`Playbook '${action.actionType}' not found.`);
    }

    action.status = "executing";
    action.logs.push(`[EXECUTION] Safety guardrails passed. Executing playbook '${playbook.title}'...`);

    const result = await playbook.execute(action);
    action.executionDurationMs = result.executionDurationMs;
    action.executedAt = new Date().toISOString();
    action.logs.push(...result.logs);

    if (result.success) {
      action.status = "completed";
      action.logs.push(`[COMPLETE] Action execution completed successfully in ${result.executionDurationMs}ms.`);
    } else {
      action.status = "failed";
      action.logs.push(`[FAILURE] Action execution failed.`);
    }

    return action;
  }
}
