import { useState, useEffect, useCallback } from "react";
import { Incident } from "@aegis/types";
import { MOCK_INCIDENTS } from "@/mocks/incidents";
import { fetchFromApi } from "@/lib/api-client";

export interface UseIncidentsOptions {
  severity?: string;
  status?: string;
  search?: string;
}

export function useIncidents(options?: UseIncidentsOptions) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (options?.severity && options.severity !== "all") params.append("severity", options.severity);
    if (options?.status && options.status !== "all") params.append("status", options.status);
    if (options?.search) params.append("search", options.search);
    const queryString = params.toString() ? `?${params.toString()}` : "";

    let filteredMocks = [...MOCK_INCIDENTS];
    if (options?.severity && options.severity !== "all") {
      filteredMocks = filteredMocks.filter((i) => i.severity === options.severity);
    }
    if (options?.status && options.status !== "all") {
      filteredMocks = filteredMocks.filter((i) => i.status === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      filteredMocks = filteredMocks.filter((i) => i.code.toLowerCase().includes(q) || i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q));
    }

    const res = await fetchFromApi<Incident[]>(`/incidents${queryString}`, filteredMocks);
    setIncidents(res.data);
    setIsLive(res.isLive);
    setError(res.error);
    setLoading(false);
  }, [options?.severity, options?.status, options?.search]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return { incidents, loading, isLive, error, refetch: fetchIncidents };
}

export function useIncidentDetail(id: string) {
  const [incident, setIncident] = useState<Incident | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchIncident = useCallback(async () => {
    setLoading(true);
    const mockMatch = MOCK_INCIDENTS.find((i) => i.id === id || i.code === id);
    const res = await fetchFromApi<Incident | undefined>(`/incidents/${id}`, mockMatch);
    setIncident(res.data);
    setIsLive(res.isLive);
    setError(res.error);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (id) fetchIncident();
  }, [id, fetchIncident]);

  return { incident, loading, isLive, error, refetch: fetchIncident };
}
