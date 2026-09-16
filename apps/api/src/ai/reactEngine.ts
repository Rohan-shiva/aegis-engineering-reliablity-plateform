import { AIInvestigation, AIToolCall } from "@aegis/types";
import { ToolRegistry, ToolName } from "./toolRegistry";
import { HypothesisEngine } from "./hypothesisEngine";

export interface ReActExecutionInput {
  targetIncidentCode?: string;
  targetServiceName?: string;
  title?: string;
}

export class ReActEngine {
  public static async runInvestigation(input: ReActExecutionInput): Promise<AIInvestigation> {
    const id = `inv-${Date.now()}`;
    const incidentCode = input.targetIncidentCode || "INC-8092";
    const serviceName = input.targetServiceName || "auth-identity-svc";
    const title = input.title || `Automated ReAct Root Cause Analysis: ${incidentCode} (${serviceName})`;

    const startTime = new Date().toISOString();
    const toolCalls: AIToolCall[] = [];

    // Step 1: Initial Thought
    let plannerThought = `[ReAct Loop Initialized]\nTarget Incident: ${incidentCode}\nTarget Service: ${serviceName}\nFormulating diagnostic hypothesis... First step: Check recent deployment history for high-risk commits on '${serviceName}'.`;

    // Step 2: Tool Call 1 - getRecentDeployments
    const call1 = await ToolRegistry.executeTool(`call-1-${Date.now()}`, "getRecentDeployments", {
      serviceName,
      limit: 5,
    });
    toolCalls.push(call1);

    plannerThought += `\n\n[Observation 1]: ${call1.resultSummary.split("\n")[0]}\nProceeding to query log error traces and stack dumps for '${serviceName}'.`;

    // Step 3: Tool Call 2 - queryLogs
    const call2 = await ToolRegistry.executeTool(`call-2-${Date.now()}`, "queryLogs", {
      serviceName,
      query: "ERROR",
    });
    toolCalls.push(call2);

    plannerThought += `\n\n[Observation 2]: ${call2.resultSummary.split("\n")[0]}\nChecking service topology to inspect upstream/downstream dependencies.`;

    // Step 4: Tool Call 3 - getServiceDependencies
    const call3 = await ToolRegistry.executeTool(`call-3-${Date.now()}`, "getServiceDependencies", {
      serviceName,
    });
    toolCalls.push(call3);

    plannerThought += `\n\n[Observation 3]: Topology inspection completed. Executing 1536-dim vector RAG search against knowledge base runbooks.`;

    // Step 5: Tool Call 4 - searchKnowledge
    const call4 = await ToolRegistry.executeTool(`call-4-${Date.now()}`, "searchKnowledge", {
      query: `${serviceName} connection pool error`,
      topK: 3,
    });
    toolCalls.push(call4);

    plannerThought += `\n\n[Final Synthesis]: Gathered 4 evidence artifacts across deployments, log traces, service topology, and RAG vector store. Synthesizing final confidence score and hypotheses ranking.`;

    // Step 6: Evidence Evaluation & Hypothesis Ranking
    const evaluation = HypothesisEngine.evaluate({
      incidentCode,
      serviceName,
      toolCalls,
    });

    const now = new Date().toISOString();

    const investigation: AIInvestigation = {
      id,
      title,
      targetIncidentCode: incidentCode,
      targetServiceName: serviceName,
      status: "completed",
      confidenceScore: evaluation.confidenceScore,
      createdAt: startTime,
      updatedAt: now,
      plannerThought,
      hypotheses: evaluation.hypotheses,
      toolCalls,
      citations: evaluation.citations,
      recommendedActions: evaluation.recommendedActions,
    };

    return investigation;
  }
}
