import { Request, Response } from "express";
import { VectorStore } from "../rag/vectorStore";
import { ToolRegistry } from "../ai/toolRegistry";
import { RemediationRegistry } from "../remediation/remediationRegistry";
import { AegisWsServer } from "../websocket/wsServer";

export interface SystemStatusResponse {
  platform: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
  components: {
    apiServer: {
      status: "healthy" | "degraded" | "failing";
      version: string;
      memoryRssMb: number;
      heapUsedMb: number;
    };
    webSocketStream: {
      status: "healthy" | "degraded" | "offline";
      connectedClientsCount: number;
      tickerIntervalMs: number;
    };
    vectorDatabase: {
      status: "healthy" | "degraded";
      embeddingDimension: number;
      indexedVectorChunksCount: number;
    };
    aiAgentEngine: {
      status: "healthy";
      registeredToolsCount: number;
      reasoningLoopMode: "ReAct";
    };
    remediationGuardrails: {
      status: "healthy";
      registeredPlaybooksCount: number;
      humanApprovalPolicy: "enforced";
    };
  };
}

export class SystemController {
  public static async getSystemStatus(req: Request, res: Response): Promise<void> {
    try {
      const memory = process.memoryUsage();

      const status: SystemStatusResponse = {
        platform: "Aegis Engineering Reliability Platform",
        environment: process.env.NODE_ENV || "development",
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        components: {
          apiServer: {
            status: "healthy",
            version: "v0.1.0",
            memoryRssMb: Math.round(memory.rss / (1024 * 1024)),
            heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
          },
          webSocketStream: {
            status: "healthy",
            connectedClientsCount: AegisWsServer.getClientCount(),
            tickerIntervalMs: 3000,
          },
          vectorDatabase: {
            status: "healthy",
            embeddingDimension: 1536,
            indexedVectorChunksCount: VectorStore.getVectorCount(),
          },
          aiAgentEngine: {
            status: "healthy",
            registeredToolsCount: ToolRegistry.listTools().length,
            reasoningLoopMode: "ReAct",
          },
          remediationGuardrails: {
            status: "healthy",
            registeredPlaybooksCount: RemediationRegistry.listPlaybooks().length,
            humanApprovalPolicy: "enforced",
          },
        },
      };

      res.status(200).json({
        success: true,
        data: status,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve system status diagnostics",
        details: msg,
      });
    }
  }
}
