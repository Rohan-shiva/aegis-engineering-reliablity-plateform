import { TelemetryDatapoint, DashboardMetricsSummary } from "@/types/domain";

export const MOCK_TELEMETRY_SERIES: TelemetryDatapoint[] = [
  { timestamp: "00:00", errorRate: 0.12, p99LatencyMs: 45, requestVolume: 1200 },
  { timestamp: "04:00", errorRate: 0.10, p99LatencyMs: 42, requestVolume: 850 },
  { timestamp: "08:00", errorRate: 0.25, p99LatencyMs: 60, requestVolume: 2400 },
  { timestamp: "12:00", errorRate: 0.18, p99LatencyMs: 58, requestVolume: 3800 },
  { timestamp: "14:00", errorRate: 0.40, p99LatencyMs: 95, requestVolume: 4200 },
  { timestamp: "16:00", errorRate: 2.80, p99LatencyMs: 340, requestVolume: 4600 },
  { timestamp: "16:30", errorRate: 14.20, p99LatencyMs: 1420, requestVolume: 4900 },
  { timestamp: "17:00", errorRate: 8.50, p99LatencyMs: 820, requestVolume: 4700 },
];

export const MOCK_DASHBOARD_SUMMARY: DashboardMetricsSummary = {
  totalServices: 12,
  healthyServicesCount: 10,
  degradedServicesCount: 1,
  criticalServicesCount: 1,
  activeIncidentsCount: 2,
  sev1IncidentsCount: 1,
  deployments24hCount: 18,
  deploymentSuccessRatePercentage: 94.4,
  mttrMinutes: 18.4,
  mttrChangePercentage: -12.3,
};
