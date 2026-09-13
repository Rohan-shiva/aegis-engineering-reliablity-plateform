import { KnowledgeDocument } from "@aegis/types";
import { DatabaseClient, db } from "../db/client";

const MOCK_KNOWLEDGE: KnowledgeDocument[] = [
  {
    id: "kb-201",
    title: "Payment Checkout Connection Pool & Database Triage Runbook",
    description: "Standard operating procedure for diagnosing and mitigating 500 error spikes, connection pool starvations, and Redis cache fallbacks.",
    type: "runbook",
    source: "github",
    author: "Alex Rivera (Staff SRE)",
    updatedAt: "2026-09-08T11:20:00Z",
    ingestionStatus: "indexed",
    vectorChunksCount: 6,
    tags: ["runbook", "checkout", "postgres", "triage"],
    contentMarkdown: "# Emergency Payment Triage Procedure\n\n1. Inspect active connection pools...",
    linkedServices: ["svc-checkout", "svc-orders"],
    linkedIncidents: ["inc-101"],
    fileSize: "14.2 KB",
  },
  {
    id: "kb-202",
    title: "Postmortem: August 2026 OAuth Token Cache Outage",
    description: "Detailed root-cause analysis and systemic prevention actions following the Redis eviction cascade during high-volume sale event.",
    type: "postmortem",
    source: "confluence",
    author: "Sarah Chen (Principal Lead)",
    updatedAt: "2026-08-28T16:45:00Z",
    ingestionStatus: "indexed",
    vectorChunksCount: 12,
    tags: ["postmortem", "redis", "auth", "sev1"],
    contentMarkdown: "# Incident Postmortem — Auth Cache Outage\n\n## Timeline\n- 09:12 UTC: Alert fired...",
    linkedServices: ["svc-auth"],
    linkedIncidents: ["inc-102"],
    fileSize: "38.6 KB",
  },
];

export class KnowledgeRepository {
  public static async getAll(filters?: { type?: string; status?: string; search?: string }): Promise<KnowledgeDocument[]> {
    if (DatabaseClient.isDbAvailable()) {
      try {
        const whereClause: any = {};
        if (filters?.type) whereClause.type = filters.type;
        if (filters?.status) whereClause.ingestionStatus = filters.status;
        if (filters?.search) {
          whereClause.OR = [
            { title: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
          ];
        }
        const records = await db.knowledgeDocument.findMany({ where: whereClause });
        if (records.length > 0) return records;
      } catch (err) {
        console.warn("[KnowledgeRepository] DB query failed, using memory fallback:", err);
      }
    }

    let result = [...MOCK_KNOWLEDGE];
    if (filters?.type) {
      result = result.filter((k) => k.type === filters.type);
    }
    if (filters?.status) {
      result = result.filter((k) => k.ingestionStatus === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((k) => k.title.toLowerCase().includes(q) || k.description.toLowerCase().includes(q));
    }
    return result;
  }

  public static async getById(id: string): Promise<KnowledgeDocument | undefined> {
    if (DatabaseClient.isDbAvailable()) {
      try {
        const record = await db.knowledgeDocument.findUnique({ where: { id } });
        if (record) return record;
      } catch (err) {
        console.warn("[KnowledgeRepository] DB lookup failed, using memory fallback:", err);
      }
    }

    return MOCK_KNOWLEDGE.find((k) => k.id === id);
  }
}
