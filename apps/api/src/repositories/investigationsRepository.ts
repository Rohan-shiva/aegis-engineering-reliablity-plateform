import { AIInvestigation } from "@aegis/types";

const MOCK_INVESTIGATIONS: AIInvestigation[] = [
  {
    id: "inv-101",
    title: "Payment Checkout 500 Error Spike Root Cause Analysis",
    targetIncidentCode: "INC-8492",
    targetServiceName: "payment-checkout-svc",
    status: "completed",
    confidenceScore: 89,
    createdAt: "2026-09-10T14:38:00Z",
    updatedAt: "2026-09-10T14:42:15Z",
    plannerThought: "Correlating deployment dep-501 (commit 8a4f912c) with elevated P99 latency spikes (1350ms) and Postgres connection pool starvation logs.",
    hypotheses: [
      {
        id: "hyp-1",
        rank: 1,
        title: "Connection pool exhaustion due to missing idle connection timeout in deployment 8a4f912c",
        confidencePercentage: 89,
        reasoningText: "Deployment 8a4f912c modified pool.ts settings. Subsequent log queries reveal 100% pool acquisition timeouts.",
        isPrimary: true,
        evidenceCategory: "deployment_diff",
      },
    ],
    toolCalls: [
      {
        id: "tc-1",
        toolName: "getRecentDeployments",
        args: { serviceId: "svc-checkout", limit: 3 },
        status: "success",
        executionTimeMs: 120,
        resultSummary: "Found 1 recent deployment (dep-501) 3 mins prior to alert.",
      },
      {
        id: "tc-2",
        toolName: "queryLogs",
        args: { serviceId: "svc-checkout", query: "error AND pool" },
        status: "success",
        executionTimeMs: 340,
        resultSummary: "Retrieved 412 log lines matching 'ConnectionPoolTimeoutException'.",
      },
    ],
    citations: [
      { id: "cit-1", title: "Commit 8a4f912c diff in pool.ts", url: "https://github.com/aegis-org/payment-checkout-svc/commit/8a4f912c", type: "commit", relevanceScore: 0.96 },
      { id: "cit-2", title: "Runbook KB-201 Connection Pool Triage", url: "/knowledge/kb-201", type: "runbook", relevanceScore: 0.88 },
    ],
    recommendedActions: [
      "Rollback payment-checkout-svc deployment to commit 7b19a04f",
      "Apply pool idle timeout fix in src/config/pool.ts",
    ],
  },
];

export class InvestigationsRepository {
  public static getAll(filters?: { status?: string; search?: string }): AIInvestigation[] {
    let result = [...MOCK_INVESTIGATIONS];
    if (filters?.status) {
      result = result.filter((i) => i.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((i) => i.title.toLowerCase().includes(q) || (i.targetIncidentCode && i.targetIncidentCode.toLowerCase().includes(q)));
    }
    return result;
  }

  public static getById(id: string): AIInvestigation | undefined {
    return MOCK_INVESTIGATIONS.find((i) => i.id === id);
  }
}
