import { Incident } from "@aegis/types";

const MOCK_INCIDENTS: Incident[] = [
  {
    id: "inc-101",
    code: "INC-8492",
    title: "Payment Checkout 500 Spike & Connection Pool Exhaustion",
    severity: "SEV1",
    status: "investigating",
    affectedServices: ["svc-checkout", "svc-orders"],
    summary: "Elevated 500 error rates on payment checkout processing endpoint post v2.4.1 deployment.",
    impactDescription: "14.2% checkout transaction failure rate affecting ~$42,000 revenue stream per hour.",
    rootCauseHypothesis: "Connection pool exhaustion due to missing idle connection timeout settings in payment gateway connector.",
    confidenceScore: 89,
    createdAt: "2026-09-10T14:35:00Z",
    updatedAt: "2026-09-10T14:52:00Z",
    assignedTo: {
      name: "Alex Rivera",
      role: "Staff Reliability Engineer",
      avatarInitials: "AR",
    },
    communicationChannel: "#inc-8492-checkout-spike",
    runbookUrl: "/knowledge/kb-201",
    postmortemStatus: "pending",
    timeline: [
      { id: "t-1", timestamp: "2026-09-10T14:35:00Z", title: "Automated Alert Fired", description: "Datadog P99 latency threshold >1000ms triggered SEV1 alert.", type: "detection", author: "AlertManager Bot" },
      { id: "t-2", timestamp: "2026-09-10T14:38:00Z", title: "Incident Declared & Escalated", description: "Incident commander paged Payments SRE on-call team.", type: "investigation", author: "Alex Rivera" },
    ],
  },
  {
    id: "inc-102",
    code: "INC-8488",
    title: "Redis Cache Eviction Surge & Auth Delay",
    severity: "SEV2",
    status: "mitigated",
    affectedServices: ["svc-auth"],
    summary: "High memory utilization on auth token validation cache cluster leading to eviction storm.",
    impactDescription: "Authentication P95 latency increased from 15ms to 180ms across all regional clusters.",
    rootCauseHypothesis: "Unbounded user session caching policy deployed without TTL expiration bounds.",
    confidenceScore: 94,
    createdAt: "2026-09-09T08:12:00Z",
    updatedAt: "2026-09-09T09:30:00Z",
    assignedTo: {
      name: "Sarah Chen",
      role: "Principal Infrastructure Lead",
      avatarInitials: "SC",
    },
    timeline: [],
  },
];

export class IncidentsRepository {
  public static getAll(filters?: { severity?: string; status?: string; search?: string }): Incident[] {
    let result = [...MOCK_INCIDENTS];
    if (filters?.severity) {
      result = result.filter((i) => i.severity === filters.severity);
    }
    if (filters?.status) {
      result = result.filter((i) => i.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((i) => i.code.toLowerCase().includes(q) || i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q));
    }
    return result;
  }

  public static getById(id: string): Incident | undefined {
    return MOCK_INCIDENTS.find((i) => i.id === id || i.code === id);
  }
}
