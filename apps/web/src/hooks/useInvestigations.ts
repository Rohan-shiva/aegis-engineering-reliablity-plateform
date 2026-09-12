import { useState, useEffect, useCallback } from "react";
import { AIInvestigation } from "@aegis/types";
import { MOCK_INVESTIGATIONS } from "@/mocks/investigations";
import { fetchFromApi } from "@/lib/api-client";

export interface UseInvestigationsOptions {
  status?: string;
  search?: string;
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
      filteredMocks = filteredMocks.filter((i) => i.title.toLowerCase().includes(q) || (i.targetIncidentCode && i.targetIncidentCode.toLowerCase().includes(q)));
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

  return { investigations, loading, isLive, error, refetch: fetchInvestigations };
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
