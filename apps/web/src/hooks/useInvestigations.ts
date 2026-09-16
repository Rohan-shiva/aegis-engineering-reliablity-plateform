import { useState, useEffect, useCallback } from "react";
import { AIInvestigation } from "@aegis/types";
import { MOCK_INVESTIGATIONS } from "@/mocks/investigations";
import { fetchFromApi } from "@/lib/api-client";

export interface UseInvestigationsOptions {
  status?: string;
  search?: string;
}

export interface TriggerInvestigationParams {
  targetIncidentCode?: string;
  targetServiceName?: string;
  title?: string;
}

export function useInvestigations(options?: UseInvestigationsOptions) {
  const [investigations, setInvestigations] = useState<AIInvestigation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchInvestigations = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (options?.status && options.status !== "all") params.append("status", options.status);
    if (options?.search) params.append("search", options.search);
    const queryString = params.toString() ? `?${params.toString()}` : "";

    let filteredMocks = [...MOCK_INVESTIGATIONS];
    if (options?.status && options.status !== "all") {
      filteredMocks = filteredMocks.filter((i) => i.status === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      filteredMocks = filteredMocks.filter(
        (i) => i.title.toLowerCase().includes(q) || (i.targetIncidentCode && i.targetIncidentCode.toLowerCase().includes(q))
      );
    }

    const res = await fetchFromApi<AIInvestigation[]>(`/investigations${queryString}`, filteredMocks);
    setInvestigations(res.data);
    setIsLive(res.isLive);
    setError(res.error);
    setLoading(false);
  }, [options?.status, options?.search]);

  useEffect(() => {
    fetchInvestigations();
  }, [fetchInvestigations]);

  const triggerInvestigation = async (params: TriggerInvestigationParams): Promise<AIInvestigation> => {
    const incidentCode = params.targetIncidentCode || "INC-8092";
    const serviceName = params.targetServiceName || "auth-identity-svc";
    const title = params.title || `Automated ReAct Root Cause Analysis: ${incidentCode} (${serviceName})`;

    try {
      const response = await fetch("http://localhost:4000/api/v1/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetIncidentCode: incidentCode, targetServiceName: serviceName, title }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          const newInv: AIInvestigation = json.data;
          setInvestigations((prev) => [newInv, ...prev]);
          return newInv;
        }
      }
    } catch (err) {
      console.warn("[useInvestigations] Live backend trigger failed, generating simulated ReAct run:", err);
    }

    // Fallback simulation
    const simulatedInv: AIInvestigation = {
      id: `inv-${Date.now()}`,
      title,
      targetIncidentCode: incidentCode,
      targetServiceName: serviceName,
      status: "completed",
      confidenceScore: 91,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      plannerThought: `[ReAct Loop Initialized]\nTarget Incident: ${incidentCode}\nTarget Service: ${serviceName}\nExecuted 4 tool diagnostics (Deployments, QueryLogs, ServiceTopology, VectorRAG).`,
      hypotheses: [
        {
          id: "hyp-1",
          rank: 1,
          title: "Database Connection Pool Starvation via High-Risk Deployment Rollout",
          confidencePercentage: 91,
          reasoningText: `Correlated commit rollout on ${serviceName} with HTTP 500 pool acquisition timeouts.`,
          isPrimary: true,
          evidenceCategory: "deployment_correlation",
        },
      ],
      toolCalls: [
        {
          id: "tc-1",
          toolName: "getRecentDeployments",
          args: { serviceName, limit: 3 },
          status: "success",
          executionTimeMs: 140,
          resultSummary: `Found 1 recent high-risk deployment SHA on '${serviceName}'.`,
        },
        {
          id: "tc-2",
          toolName: "queryLogs",
          args: { serviceName, query: "ERROR" },
          status: "success",
          executionTimeMs: 290,
          resultSummary: `Retrieved 4 log exception lines matching 'ConnectionPoolTimeoutException'.`,
        },
      ],
      citations: [
        {
          id: "cit-1",
          title: `Service Health Telemetry [${serviceName}]`,
          url: `/services`,
          type: "metric",
          relevanceScore: 0.94,
        },
      ],
      recommendedActions: [
        `Initiate automated rollback for deployment on ${serviceName}.`,
        `Scale max database connection pool size in Kubernetes ConfigMap.`,
      ],
    };

    setInvestigations((prev) => [simulatedInv, ...prev]);
    return simulatedInv;
  };

  return { investigations, loading, isLive, error, refetch: fetchInvestigations, triggerInvestigation };
}

export function useInvestigationDetail(id: string) {
  const [investigation, setInvestigation] = useState<AIInvestigation | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchInvestigation = useCallback(async () => {
    setLoading(true);
    const mockMatch = MOCK_INVESTIGATIONS.find((i) => i.id === id);
    const res = await fetchFromApi<AIInvestigation | undefined>(`/investigations/${id}`, mockMatch);
    setInvestigation(res.data);
    setIsLive(res.isLive);
    setError(res.error);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (id) fetchInvestigation();
  }, [id, fetchInvestigation]);

  return { investigation, loading, isLive, error, refetch: fetchInvestigation };
}
