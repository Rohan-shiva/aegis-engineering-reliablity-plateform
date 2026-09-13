import { ServiceHealth } from "@aegis/types";
import { DatabaseClient, db } from "../db/client";

const MOCK_SERVICES: ServiceHealth[] = [
  {
    id: "svc-checkout",
    name: "payment-checkout-svc",
    description: "Core payment processing & checkout transaction orchestrator microservice",
    status: "critical",
    environment: "production",
    latencyP95Ms: 420,
    latencyP99Ms: 1250,
    uptimePercentage: 98.42,
    errorRatePercentage: 8.75,
    requestRateRps: 1420,
    ownerTeam: "Payments Engineering",
    repositoryUrl: "https://github.com/aegis-org/payment-checkout-svc",
    lastDeployedAt: "2026-09-10T14:32:00Z",
    activeIncidentsCount: 2,
    framework: "Node.js (Express)",
    runtimeEnv: "Kubernetes v1.29 (AWS EKS)",
    slaTargetPercentage: 99.9,
    endpoints: [
      { method: "POST", path: "/api/v1/charge", p99LatencyMs: 1350, errorRatePercentage: 11.2, status: "failing" },
      { method: "GET", path: "/api/v1/health", p99LatencyMs: 45, errorRatePercentage: 0.0, status: "nominal" },
      { method: "POST", path: "/api/v1/refund", p99LatencyMs: 620, errorRatePercentage: 2.1, status: "degraded" },
    ],
    upstreamDependencies: [
      { serviceId: "svc-auth", serviceName: "auth-identity-svc", type: "upstream", healthStatus: "healthy", protocol: "HTTP/REST", avgLatencyMs: 38 },
      { serviceId: "svc-orders", serviceName: "order-management-svc", type: "upstream", healthStatus: "degraded", protocol: "gRPC", avgLatencyMs: 140 },
    ],
    downstreamDependencies: [
      { serviceId: "svc-stripe", serviceName: "stripe-gateway-api", type: "downstream", healthStatus: "degraded", protocol: "HTTP/REST", avgLatencyMs: 850 },
      { serviceId: "svc-redis", serviceName: "checkout-cache-redis", type: "downstream", healthStatus: "healthy", protocol: "Redis", avgLatencyMs: 2.4 },
    ],
  },
  {
    id: "svc-auth",
    name: "auth-identity-svc",
    description: "OAuth2 / OIDC authentication, JWT issuance, and RBAC token validator",
    status: "healthy",
    environment: "production",
    latencyP95Ms: 24,
    latencyP99Ms: 48,
    uptimePercentage: 99.99,
    errorRatePercentage: 0.04,
    requestRateRps: 4500,
    ownerTeam: "Security & IAM",
    repositoryUrl: "https://github.com/aegis-org/auth-identity-svc",
    lastDeployedAt: "2026-09-08T09:15:00Z",
    activeIncidentsCount: 0,
    framework: "Go (Gin)",
    runtimeEnv: "Kubernetes v1.29 (AWS EKS)",
    slaTargetPercentage: 99.99,
  },
  {
    id: "svc-orders",
    name: "order-management-svc",
    description: "Order lifecycle manager, inventory reservation, and cart checkout sync",
    status: "degraded",
    environment: "production",
    latencyP95Ms: 180,
    latencyP99Ms: 450,
    uptimePercentage: 99.4,
    errorRatePercentage: 2.4,
    requestRateRps: 2100,
    ownerTeam: "Core Platform",
    repositoryUrl: "https://github.com/aegis-org/order-management-svc",
    lastDeployedAt: "2026-09-09T18:00:00Z",
    activeIncidentsCount: 1,
    framework: "Java (Spring Boot 3)",
    runtimeEnv: "Kubernetes v1.29 (AWS EKS)",
    slaTargetPercentage: 99.9,
  },
];

export class ServicesRepository {
  public static async getAll(filters?: { status?: string; search?: string }): Promise<ServiceHealth[]> {
    if (DatabaseClient.isDbAvailable()) {
      try {
        const whereClause: any = {};
        if (filters?.status) whereClause.status = filters.status;
        if (filters?.search) {
          whereClause.OR = [
            { name: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
          ];
        }
        const records = await db.service.findMany({ where: whereClause });
        if (records.length > 0) return records;
      } catch (err) {
        console.warn("[ServicesRepository] DB query failed, using memory fallback:", err);
      }
    }

    let result = [...MOCK_SERVICES];
    if (filters?.status) {
      result = result.filter((s) => s.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
    return result;
  }

  public static async getById(id: string): Promise<ServiceHealth | undefined> {
    if (DatabaseClient.isDbAvailable()) {
      try {
        const record = await db.service.findFirst({
          where: { OR: [{ id }, { name: id }] },
        });
        if (record) return record;
      } catch (err) {
        console.warn("[ServicesRepository] DB lookup failed, using memory fallback:", err);
      }
    }

    return MOCK_SERVICES.find((s) => s.id === id || s.name === id);
  }
}
