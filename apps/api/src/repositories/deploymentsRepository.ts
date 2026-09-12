import { Deployment } from "@aegis/types";

const MOCK_DEPLOYMENTS: Deployment[] = [
  {
    id: "dep-501",
    serviceId: "svc-checkout",
    serviceName: "payment-checkout-svc",
    environment: "PROD",
    commitSha: "8a4f912c",
    commitMessage: "feat(checkout): bump stripe SDK to v14.2 & refactor connection pool options",
    author: {
      name: "Marcus Vance",
      githubHandle: "marcus-vance",
      avatarUrl: "https://github.com/marcus-vance.png",
    },
    deployedAt: "2026-09-10T14:32:00Z",
    status: "failed",
    riskScore: 88,
    riskLevel: "HIGH",
    riskFactors: [
      "Modified payment processing core logic (+142, -89 lines)",
      "Upgraded major external payment gateway SDK dependency",
      "Historical incident overlap: INC-7721 shared database migration pattern",
    ],
    changedFiles: [
      { filename: "src/connectors/stripe.ts", additions: 84, deletions: 12, status: "modified", isHighRisk: true },
      { filename: "src/config/pool.ts", additions: 58, deletions: 77, status: "modified", isHighRisk: true },
    ],
  },
  {
    id: "dep-502",
    serviceId: "svc-auth",
    serviceName: "auth-identity-svc",
    environment: "PROD",
    commitSha: "3f109bc4",
    commitMessage: "fix(jwt): reduce token clock skew tolerance from 60s to 5s",
    author: {
      name: "Elena Rostova",
      githubHandle: "elena-rostova",
    },
    deployedAt: "2026-09-08T09:15:00Z",
    status: "success",
    riskScore: 24,
    riskLevel: "LOW",
    riskFactors: ["Security hotfix validation passed", "Zero schema migrations"],
  },
];

export class DeploymentsRepository {
  public static getAll(filters?: { environment?: string; status?: string; minRiskScore?: number }): Deployment[] {
    let result = [...MOCK_DEPLOYMENTS];
    if (filters?.environment) {
      result = result.filter((d) => d.environment === filters.environment);
    }
    if (filters?.status) {
      result = result.filter((d) => d.status === filters.status);
    }
    if (filters?.minRiskScore !== undefined) {
      result = result.filter((d) => d.riskScore >= filters.minRiskScore!);
    }
    return result;
  }

  public static getById(id: string): Deployment | undefined {
    return MOCK_DEPLOYMENTS.find((d) => d.id === id || d.commitSha === id);
  }
}
