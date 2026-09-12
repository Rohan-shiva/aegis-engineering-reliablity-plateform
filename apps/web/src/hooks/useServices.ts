import { useState, useEffect, useCallback } from "react";
import { ServiceHealth } from "@aegis/types";
import { MOCK_SERVICES } from "@/mocks/services";
import { fetchFromApi } from "@/lib/api-client";

export interface UseServicesOptions {
  status?: string;
  search?: string;
}

export function useServices(options?: UseServicesOptions) {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    let queryParams = "";
    if (options?.status || options?.search) {
      const params = new URLSearchParams();
      if (options.status && options.status !== "all") params.append("status", options.status);
      if (options.search) params.append("search", options.search);
      queryParams = `?${params.toString()}`;
    }

    let filteredMocks = [...MOCK_SERVICES];
    if (options?.status && options.status !== "all") {
      filteredMocks = filteredMocks.filter((s) => s.status === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      filteredMocks = filteredMocks.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }

    const res = await fetchFromApi<ServiceHealth[]>(`/services${queryParams}`, filteredMocks);
    setServices(res.data);
    setIsLive(res.isLive);
    setError(res.error);
    setLoading(false);
  }, [options?.status, options?.search]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, isLive, error, refetch: fetchServices };
}

export function useServiceDetail(id: string) {
  const [service, setService] = useState<ServiceHealth | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchService = useCallback(async () => {
    setLoading(true);
    const mockMatch = MOCK_SERVICES.find((s) => s.id === id || s.name === id);
    const res = await fetchFromApi<ServiceHealth | undefined>(`/services/${id}`, mockMatch);
    setService(res.data);
    setIsLive(res.isLive);
    setError(res.error);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (id) fetchService();
  }, [id, fetchService]);

  return { service, loading, isLive, error, refetch: fetchService };
}
