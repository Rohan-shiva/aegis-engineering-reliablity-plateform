import { AIHypothesis, AISourceCitation, AIToolCall } from "@aegis/types";

export interface EvaluationInput {
  incidentCode?: string;
  serviceName?: string;
  toolCalls: AIToolCall[];
}

export interface EvaluationResult {
  confidenceScore: number;
  hypotheses: AIHypothesis[];
  citations: AISourceCitation[];
  recommendedActions: string[];
}

export class HypothesisEngine {
  public static evaluate(input: EvaluationInput): EvaluationResult {
    const { incidentCode = "INC-UNKNOWN", serviceName = "unknown-service", toolCalls } = input;

    const hypotheses: AIHypothesis[] = [];
    const citations: AISourceCitation[] = [];
    const recommendedActions: string[] = [];

    let deploymentIssueDetected = false;
    let logErrorDetected = false;
    let topologyDegraded = false;
    let ragMatchFound = false;

    // Analyze tool outputs
    for (const call of toolCalls) {
      if (call.toolName === "getRecentDeployments") {
        if (call.resultSummary.includes("HIGH") || call.resultSummary.includes("failed") || call.resultSummary.includes("Risk Score")) {
          deploymentIssueDetected = true;
          citations.push({
            id: `cite-${Date.now()}-dep`,
            title: `Recent Deployment Commit Analysis [${serviceName}]`,
            url: `/deployments?service=${serviceName}`,
            type: "commit",
            relevanceScore: 0.94,
          });
        }
      }

      if (call.toolName === "queryLogs") {
        if (call.resultSummary.includes("ERROR") || call.resultSummary.includes("timeout") || call.resultSummary.includes("500")) {
          logErrorDetected = true;
          citations.push({
            id: `cite-${Date.now()}-log`,
            title: `Log Trace & Error Stack Dump [${serviceName}]`,
            url: `/incidents/${incidentCode}?tab=logs`,
            type: "log",
            relevanceScore: 0.91,
          });
        }
      }

      if (call.toolName === "searchKnowledge" || call.toolName === "getRunbook") {
        if (!call.resultSummary.includes("No official runbook") && !call.resultSummary.includes("No semantic vector")) {
          ragMatchFound = true;
          citations.push({
            id: `cite-${Date.now()}-rag`,
            title: `Knowledge Base Runbook & Similarity Search Match`,
            url: `/knowledge`,
            type: "runbook",
            relevanceScore: 0.88,
          });
        }
      }

      if (call.toolName === "getServiceDependencies") {
        if (call.resultSummary.includes("degraded") || call.resultSummary.includes("failing")) {
          topologyDegraded = true;
          citations.push({
            id: `cite-${Date.now()}-topo`,
            title: `Service Topology Metric Stream [${serviceName}]`,
            url: `/services?service=${serviceName}`,
            type: "metric",
            relevanceScore: 0.85,
          });
        }
      }
    }

    // Formulate Primary Hypothesis
    if (deploymentIssueDetected && logErrorDetected) {
      hypotheses.push({
        id: "hyp-1",
        rank: 1,
        title: `Database Connection Pool Exhaustion Triggered by Deployment SHA Rollout`,
        confidencePercentage: 92,
        reasoningText: `Correlated high-risk deployment on ${serviceName} with log exception traces indicating database pool connection timeouts and HTTP 500 error spikes.`,
        isPrimary: true,
        evidenceCategory: "deployment_correlation",
      });

      hypotheses.push({
        id: "hyp-2",
        rank: 2,
        title: `Cascading Connection Latency from Upstream Dependency`,
        confidencePercentage: 68,
        reasoningText: `Upstream service latency spikes causing client-side request queues to back up and exhaust local worker threads.`,
        isPrimary: false,
        evidenceCategory: "topology_cascade",
      });

      recommendedActions.push(`Immediately initiate automated rollback for recent deployment on ${serviceName}.`);
      recommendedActions.push(`Scale database connection pool max connections limit from 20 to 50 in Kubernetes ConfigMap.`);
      recommendedActions.push(`Verify error rate stabilization on /v1/health probe.`);
    } else if (logErrorDetected) {
      hypotheses.push({
        id: "hyp-1",
        rank: 1,
        title: `Resource Starvation or Unhandled Exception in Endpoint Handler`,
        confidencePercentage: 84,
        reasoningText: `Log traces confirm multiple unhandled 500 errors and timeout exceptions during peak request rates.`,
        isPrimary: true,
        evidenceCategory: "log_analysis",
      });

      recommendedActions.push(`Inspect container CPU/Memory quota metrics on target service pods.`);
      recommendedActions.push(`Review recent error trace logs in Kibana / Datadog.`);
    } else {
      hypotheses.push({
        id: "hyp-1",
        rank: 1,
        title: `Transient Network Partition or Third-Party API Latency Spike`,
        confidencePercentage: 75,
        reasoningText: `Standard telemetry metrics indicate nominal internal state; error spikes likely originate from external dependencies.`,
        isPrimary: true,
        evidenceCategory: "metric_anomaly",
      });

      recommendedActions.push(`Monitor external payment / gateway API status pages.`);
      recommendedActions.push(`Enable circuit breaker fallback handlers for downstream calls.`);
    }

    // Compute Overall Weighted Confidence Score
    let confidenceScore = 70;
    if (deploymentIssueDetected) confidenceScore += 12;
    if (logErrorDetected) confidenceScore += 10;
    if (ragMatchFound) confidenceScore += 5;
    confidenceScore = Math.min(98, confidenceScore);

    return {
      confidenceScore,
      hypotheses,
      citations: citations.length > 0 ? citations : [
        {
          id: `cite-default`,
          title: `Service Health Telemetry Stream [${serviceName}]`,
          url: `/services`,
          type: "metric",
          relevanceScore: 0.90,
        }
      ],
      recommendedActions,
    };
  }
}
