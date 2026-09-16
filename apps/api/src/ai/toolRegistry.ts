import { AIToolCall, Deployment, KnowledgeDocument, ServiceHealth } from "@aegis/types";
import { DeploymentsRepository } from "../repositories/deploymentsRepository";
import { ServicesRepository } from "../repositories/servicesRepository";
import { KnowledgeRepository } from "../repositories/knowledgeRepository";
import { VectorStore } from "../rag/vectorStore";

export type ToolName =
  | "getRecentDeployments"
  | "queryLogs"
  | "searchKnowledge"
  | "getServiceDependencies"
  | "getRunbook";

export interface ToolDefinition {
  name: ToolName;
  description: string;
  handler: (args: Record<string, string | number | boolean>) => Promise<{ summary: string; rawData: unknown }>;
}

export class ToolRegistry {
  private static tools: Map<ToolName, ToolDefinition> = new Map();

  public static registerTool(def: ToolDefinition): void {
    this.tools.set(def.name, def);
  }

  public static getTool(name: ToolName): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  public static listTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public static async executeTool(
    id: string,
    toolName: ToolName,
    args: Record<string, string | number | boolean>
  ): Promise<AIToolCall> {
    const startTime = Date.now();
    const tool = this.tools.get(toolName);

    if (!tool) {
      return {
        id,
        toolName,
        args,
        status: "failed",
        executionTimeMs: Date.now() - startTime,
        resultSummary: `Tool ${toolName} not found in registry.`,
      };
    }

    try {
      const result = await tool.handler(args);
      const executionTimeMs = Date.now() - startTime;
      return {
        id,
        toolName,
        args,
        status: "success",
        executionTimeMs,
        resultSummary: result.summary,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        id,
        toolName,
        args,
        status: "failed",
        executionTimeMs: Date.now() - startTime,
        resultSummary: `Tool execution failed: ${errorMsg}`,
      };
    }
  }
}

// 1. Tool: getRecentDeployments
ToolRegistry.registerTool({
  name: "getRecentDeployments",
  description: "Fetches recent production and staging deployment events for a target service.",
  handler: async (args) => {
    const serviceName = String(args.serviceName || args.serviceId || "all");
    const limit = Number(args.limit || 5);
    const deployments: Deployment[] = await DeploymentsRepository.getAll();
    
    let filtered = deployments;
    if (serviceName !== "all") {
      filtered = deployments.filter(
        (d: Deployment) => d.serviceName.toLowerCase().includes(serviceName.toLowerCase()) || d.serviceId === serviceName
      );
    }
    const recent = filtered.slice(0, limit);

    if (recent.length === 0) {
      return {
        summary: `No recent deployments found for service '${serviceName}'.`,
        rawData: [],
      };
    }

    const summaries = recent.map(
      (d: Deployment) => `SHA [${d.commitSha.substring(0, 7)}] by ${d.author.name}: "${d.commitMessage}" (Risk Score: ${d.riskScore}/100, Status: ${d.status})`
    );

    return {
      summary: `Found ${recent.length} recent deployment(s) for '${serviceName}':\n` + summaries.join("\n"),
      rawData: recent,
    };
  },
});

// 2. Tool: queryLogs
ToolRegistry.registerTool({
  name: "queryLogs",
  description: "Queries log streams and error trace records for a service around an alert timeframe.",
  handler: async (args) => {
    const serviceName = String(args.serviceName || "auth-service");
    const query = String(args.query || "ERROR");
    
    const sampleLogLines = [
      `[ERROR] [${serviceName}] DB connection timeout pool size exhausted (max: 20)`,
      `[WARN] [${serviceName}] High HTTP 500 error rate detected on /v1/auth/token endpoint`,
      `[FATAL] [${serviceName}] Redis connection refusal at redis-primary.internal:6379`,
      `[INFO] [${serviceName}] Health check probe failed 3 consecutive times`,
    ];

    const matched = sampleLogLines.filter(
      (l: string) => l.toLowerCase().includes(query.toLowerCase()) || query === "ERROR"
    );
    
    return {
      summary: `Retrieved ${matched.length} log error trace line(s) matching query '${query}':\n` + matched.join("\n"),
      rawData: matched,
    };
  },
});

// 3. Tool: searchKnowledge (RAG Vector Store Integration)
ToolRegistry.registerTool({
  name: "searchKnowledge",
  description: "Executes 1536-dim vector similarity search over runbooks and postmortems in the RAG knowledge base.",
  handler: async (args) => {
    const query = String(args.query || "Postgres connection pool exhaustion");
    const topK = Number(args.topK || 3);
    
    const searchResults = VectorStore.searchSimilar(query, topK);

    if (searchResults.length === 0) {
      // Fallback to knowledge repository search
      const docs: KnowledgeDocument[] = await KnowledgeRepository.getAll();
      const match = docs.find(
        (d: KnowledgeDocument) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.tags.some((t: string) => t.includes(query.toLowerCase()))
      );
      if (match) {
        return {
          summary: `RAG Vector Match (Fallback): '${match.title}' [DocID: ${match.id}]\n${match.description}`,
          rawData: [match],
        };
      }
      return {
        summary: `No semantic vector matches found in knowledge base for query '${query}'.`,
        rawData: [],
      };
    }

    const summaries = searchResults.map(
      (res, idx) => `#${idx + 1} [Score: ${(res.similarityScore * 100).toFixed(1)}%] ${res.documentTitle}: "${res.chunk.textSnippet.substring(0, 120)}..."`
    );

    return {
      summary: `Found ${searchResults.length} RAG vector match(es) for query '${query}':\n` + summaries.join("\n"),
      rawData: searchResults,
    };
  },
});

// 4. Tool: getServiceDependencies
ToolRegistry.registerTool({
  name: "getServiceDependencies",
  description: "Maps upstream and downstream service topology and health metrics.",
  handler: async (args) => {
    const serviceName = String(args.serviceName || "api-gateway");
    const services: ServiceHealth[] = await ServicesRepository.getAll();
    const target = services.find(
      (s: ServiceHealth) => s.name.toLowerCase() === serviceName.toLowerCase() || s.id === serviceName
    );

    if (!target) {
      return {
        summary: `Service '${serviceName}' not found in registry topology.`,
        rawData: null,
      };
    }

    const up = target.upstreamDependencies || [];
    const down = target.downstreamDependencies || [];

    const upStr = up.map((d) => `${d.serviceName} (${d.protocol}, ${d.healthStatus})`).join(", ") || "None";
    const downStr = down.map((d) => `${d.serviceName} (${d.protocol}, ${d.healthStatus})`).join(", ") || "None";

    return {
      summary: `Topology for '${target.name}' [Status: ${target.status}]:\n- Upstream Dependencies: ${upStr}\n- Downstream Dependencies: ${downStr}`,
      rawData: { target, upstream: up, downstream: down },
    };
  },
});

// 5. Tool: getRunbook
ToolRegistry.registerTool({
  name: "getRunbook",
  description: "Fetches official incident remediation runbook guidelines for a given service or incident type.",
  handler: async (args) => {
    const topic = String(args.topic || args.serviceName || "database");
    const docs: KnowledgeDocument[] = await KnowledgeRepository.getAll();
    const runbooks = docs.filter((d: KnowledgeDocument) => d.type === "runbook");

    const match = runbooks.find(
      (r: KnowledgeDocument) => r.title.toLowerCase().includes(topic.toLowerCase()) || r.linkedServices.includes(topic)
    ) || runbooks[0];

    if (!match) {
      return {
        summary: `No official runbook procedures found matching topic '${topic}'.`,
        rawData: null,
      };
    }

    return {
      summary: `Runbook [${match.title}] (${match.id}):\nSummary: ${match.description}\nTarget Services: ${match.linkedServices.join(", ")}`,
      rawData: match,
    };
  },
});
