import { StatusType } from "@/components/ui/StatusBadge";
import { SeverityType } from "@/components/ui/SeverityBadge";

export interface ServiceEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  p99LatencyMs: number;
  errorRatePercentage: number;
  status: "nominal" | "degraded" | "failing";
}

export interface ServiceDependency {
  serviceId: string;
  serviceName: string;
  type: "upstream" | "downstream";
  healthStatus: StatusType;
  protocol: "HTTP/REST" | "gRPC" | "Redis" | "MongoDB" | "Kafka";
  avgLatencyMs: number;
}

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

  framework?: string;
  runtimeEnv?: string;
  slaTargetPercentage?: number;
  endpoints?: ServiceEndpoint[];
  upstreamDependencies?: ServiceDependency[];
  downstreamDependencies?: ServiceDependency[];
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: "detection" | "mitigation" | "investigation" | "update" | "resolution";
  author: string;
}

export interface TelemetrySnapshot {
  metricName: string;
  valueAtDetection: string;
  threshold: string;
  unit: string;
}

export interface IncidentEvidence {
  id: string;
  type: "log" | "metric" | "deployment" | "runbook";
  title: string;
  snippet: string;
  source: string;
}

export interface Incident {
  id: string;
  code: string;
  title: string;
  severity: SeverityType;
  status: "active" | "investigating" | "mitigated" | "resolved";
  affectedServices: string[];
  summary: string;
  impactDescription: string;
  rootCauseHypothesis?: string;
  confidenceScore?: number;
  createdAt: string;
  updatedAt: string;
  assignedTo: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  timeline: IncidentTimelineEvent[];

  communicationChannel?: string;
  runbookUrl?: string;
  postmortemStatus?: "pending" | "generated" | "none";
  telemetrySnapshots?: TelemetrySnapshot[];
  evidences?: IncidentEvidence[];
  tags?: string[];
}

export interface DeploymentChangedFile {
  filename: string;
  additions: number;
  deletions: number;
  status: "modified" | "added" | "deleted";
  isHighRisk?: boolean;
}

export interface DeploymentRiskSignal {
  id: string;
  category: "database" | "payment" | "auth" | "dependency" | "historical_incident";
  title: string;
  description: string;
  weight: number;
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
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  riskFactors: string[];

  // Extended deployment details
  changedFiles?: DeploymentChangedFile[];
  riskSignals?: DeploymentRiskSignal[];
  affectedServicesCount?: number;
  durationSeconds?: number;
  rollbackSha?: string;
}

export interface TelemetryDatapoint {
  timestamp: string;
  errorRate: number;
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
