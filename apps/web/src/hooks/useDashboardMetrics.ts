import { useState, useEffect, useCallback } from "react";
import { DashboardMetricsSummary, TelemetryDatapoint } from "@aegis/types";
import { MOCK_DASHBOARD_SUMMARY, MOCK_TELEMETRY_SERIES } from "@/mocks/telemetry";
import { fetchFromApi } from "@/lib/api-client";

export function useDashboardMetrics() {
  const [summary, setSummary] = useState<DashboardMetricsSummary>(MOCK_DASHBOARD_SUMMARY);
  const [telemetry, setTelemetry] = useState<TelemetryDatapoint[]>(MOCK_TELEMETRY_SERIES);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    const res = await fetchFromApi<DashboardMetricsSummary>("/health", MOCK_DASHBOARD_SUMMARY);
    if (res.isLive) {
      setSummary((prev) => ({ ...prev }));
    } else {
      setSummary(MOCK_DASHBOARD_SUMMARY);
    }
    setTelemetry(MOCK_TELEMETRY_SERIES);
    setIsLive(res.isLive);
    setError(res.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { summary, telemetry, loading, isLive, error, refetch: fetchMetrics };
}
