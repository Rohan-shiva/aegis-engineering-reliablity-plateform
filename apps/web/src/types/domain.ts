import { StatusType } from "@/components/ui/StatusBadge";
import { SeverityType } from "@/components/ui/SeverityBadge";

export interface ServiceHealth {
  id: string;
  name: string;
  description: string;
  status: StatusType;
  environment: "production" | "staging" | "development";
  latencyP95Ms: number;
  latencyP99Ms: number;
  uptimePercentage: number;
  errorRatePercentage: number;
  requestRateRps: number;
  ownerTeam: string;
  repositoryUrl: string;
  lastDeployedAt: string;
  activeIncidentsCount: number;
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: "detection" | "mitigation" | "investigation" | "update" | "resolution";
  author: string;
}

export interface Incident {
  id: string;
  code: string; // e.g., INC-8492
  title: string;
  severity: SeverityType;
  status: "active" | "investigating" | "mitigated" | "resolved";
  affectedServices: string[]; // Service IDs or names
  summary: string;
  impactDescription: string;
  rootCauseHypothesis?: string;
  confidenceScore?: number; // 0..100
  createdAt: string;
  updatedAt: string;
  assignedTo: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  timeline: IncidentTimelineEvent[];
}

export interface Deployment {
  id: string;
  serviceId: string;
  serviceName: string;
  environment: "PROD" | "STAGING" | "DEV";
  commitSha: string;
  commitMessage: string;
  author: {
    name: string;
    githubHandle: string;
    avatarUrl?: string;
  };
  deployedAt: string;
  status: "success" | "failed" | "in_progress" | "rolled_back";
  riskScore: number; // 0..100
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  riskFactors: string[];
}

export interface TelemetryDatapoint {
  timestamp: string; // ISO string or time label e.g., "14:00"
  errorRate: number; // percentage
  p99LatencyMs: number;
  requestVolume: number;
}

export interface DashboardMetricsSummary {
  totalServices: number;
  healthyServicesCount: number;
  degradedServicesCount: number;
  criticalServicesCount: number;
  activeIncidentsCount: number;
  sev1IncidentsCount: number;
  deployments24hCount: number;
  deploymentSuccessRatePercentage: number;
  mttrMinutes: number;
  mttrChangePercentage: number;
}
