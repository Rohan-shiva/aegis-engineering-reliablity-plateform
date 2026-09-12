import { useState, useEffect, useCallback } from "react";
import { Deployment } from "@aegis/types";
import { MOCK_DEPLOYMENTS } from "@/mocks/deployments";
import { fetchFromApi } from "@/lib/api-client";

export interface UseDeploymentsOptions {
  environment?: string;
  status?: string;
  search?: string;
}

export function useDeployments(options?: UseDeploymentsOptions) {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchDeployments = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (options?.environment && options.environment !== "all") params.append("environment", options.environment);
    if (options?.status && options.status !== "all") params.append("status", options.status);
    if (options?.search) params.append("search", options.search);
    const queryString = params.toString() ? `?${params.toString()}` : "";

    let filteredMocks = [...MOCK_DEPLOYMENTS];
    if (options?.environment && options.environment !== "all") {
      filteredMocks = filteredMocks.filter((d) => d.environment === options.environment);
    }
    if (options?.status && options.status !== "all") {
      filteredMocks = filteredMocks.filter((d) => d.status === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      filteredMocks = filteredMocks.filter((d) => d.serviceName.toLowerCase().includes(q) || d.commitMessage.toLowerCase().includes(q) || d.commitSha.toLowerCase().includes(q));
    }

    const res = await fetchFromApi<Deployment[]>(`/deployments${queryString}`, filteredMocks);
    setDeployments(res.data);
    setIsLive(res.isLive);
    setError(res.error);
    setLoading(false);
  }, [options?.environment, options?.status, options?.search]);

  useEffect(() => {
    fetchDeployments();
  }, [fetchDeployments]);

  return { deployments, loading, isLive, error, refetch: fetchDeployments };
}

export function useDeploymentDetail(id: string) {
  const [deployment, setDeployment] = useState<Deployment | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchDeployment = useCallback(async () => {
    setLoading(true);
    const mockMatch = MOCK_DEPLOYMENTS.find((d) => d.id === id || d.commitSha === id);
    const res = await fetchFromApi<Deployment | undefined>(`/deployments/${id}`, mockMatch);
    setDeployment(res.data);
    setIsLive(res.isLive);
    setError(res.error);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (id) fetchDeployment();
  }, [id, fetchDeployment]);

  return { deployment, loading, isLive, error, refetch: fetchDeployment };
}
