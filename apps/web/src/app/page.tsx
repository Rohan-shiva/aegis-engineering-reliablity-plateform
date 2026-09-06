"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { ServiceHealthGrid } from "@/components/dashboard/ServiceHealthGrid";
import { ActiveIncidentsPanel } from "@/components/dashboard/ActiveIncidentsPanel";
import { DeploymentActivityFeed } from "@/components/dashboard/DeploymentActivityFeed";
import { TelemetrySparkline } from "@/components/dashboard/TelemetrySparkline";
import { Button } from "@/components/ui/Button";
import {
  MOCK_SERVICES,
  MOCK_INCIDENTS,
  MOCK_DEPLOYMENTS,
  MOCK_TELEMETRY_SERIES,
  MOCK_DASHBOARD_SUMMARY,
} from "@/mocks";
import { Incident } from "@/types/domain";
import {
  Server,
  AlertTriangle,
  GitCommit,
  Clock,
  RefreshCw,
  Calendar,
  Bot,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OverviewDashboardPage() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Telemetry metrics refreshed successfully.");
    }, 600);
  };

  const showToast = (message: string) => {
    setActiveToast(message);
    setTimeout(() => setActiveToast(null), 3000);
  };

  const handleOpenRoom = (incident: Incident) => {
    showToast(`Entering Incident Room for ${incident.code}...`);
  };

  return (
    <AppShell>
      {/* Toast Notification Banner */}
      {activeToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-brand/40 bg-surface/95 px-4 py-3 shadow-2xl backdrop-blur-md font-mono text-xs text-slate-100">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{activeToast}</span>
        </div>
      )}

      {/* 1. Page Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-xl font-bold text-slate-100 tracking-tight">
              Reliability & Operations
            </h1>
            <span className="rounded bg-brand/10 border border-brand/20 px-2 py-0.5 font-mono text-[10px] text-brand-light">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Real-time status overview across infrastructure, active incidents, and automated AI diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range selector */}
          <div className="flex items-center rounded-md border border-slate-800 bg-slate-900/60 p-1 text-xs font-mono text-slate-400">
            <Calendar className="ml-1.5 h-3.5 w-3.5 text-slate-500" />
            <button
              onClick={() => setTimeRange("24h")}
              className={cn(
                "px-2 py-1 rounded transition-colors",
                timeRange === "24h" ? "text-slate-200 bg-slate-800 font-semibold" : "hover:text-slate-200"
              )}
            >
              24h
            </button>
            <button
              onClick={() => setTimeRange("7d")}
              className={cn(
                "px-2 py-1 rounded transition-colors",
                timeRange === "7d" ? "text-slate-200 bg-slate-800 font-semibold" : "hover:text-slate-200"
              )}
            >
              7d
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={cn(
                "px-2 py-1 rounded transition-colors",
                timeRange === "30d" ? "text-slate-200 bg-slate-800 font-semibold" : "hover:text-slate-200"
              )}
            >
              30d
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-1.5 font-mono">
            <RefreshCw className={cn("h-3.5 w-3.5 text-slate-400", isRefreshing && "animate-spin")} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* 2. Key Reliability Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Monitored Services"
          value={MOCK_DASHBOARD_SUMMARY.totalServices}
          change={`${MOCK_DASHBOARD_SUMMARY.healthyServicesCount} Healthy`}
          changeType="positive"
          subtitle={`• ${MOCK_DASHBOARD_SUMMARY.degradedServicesCount} Degraded, ${MOCK_DASHBOARD_SUMMARY.criticalServicesCount} Critical`}
          icon={Server}
          iconColor="text-blue-400"
        />
        <MetricCard
          title="Active Incidents"
          value={MOCK_DASHBOARD_SUMMARY.activeIncidentsCount}
          change={`SEV-1 Active`}
          changeType="negative"
          subtitle="• payment-gateway degraded"
          icon={AlertTriangle}
          iconColor="text-red-400"
        />
        <MetricCard
          title="Deployments Today"
          value={MOCK_DASHBOARD_SUMMARY.deployments24hCount}
          change="+14%"
          changeType="positive"
          subtitle={`• ${MOCK_DASHBOARD_SUMMARY.deploymentSuccessRatePercentage}% success rate`}
          icon={GitCommit}
          iconColor="text-emerald-400"
        />
        <MetricCard
          title="Mean Time To Resolve"
          value={`${MOCK_DASHBOARD_SUMMARY.mttrMinutes}m`}
          change={`${MOCK_DASHBOARD_SUMMARY.mttrChangePercentage}%`}
          changeType="positive"
          subtitle="• 3.2m faster than target"
          icon={Clock}
          iconColor="text-amber-400"
        />
      </div>

      {/* 3. Telemetry Sparkline Trend Bar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TelemetrySparkline
          data={MOCK_TELEMETRY_SERIES}
          title="System Error Rate (%) — Spike Detected"
          metricType="errorRate"
        />
        <TelemetrySparkline
          data={MOCK_TELEMETRY_SERIES}
          title="Global p99 Latency (ms)"
          metricType="p99LatencyMs"
        />
      </div>

      {/* 4. Main Operational Sections Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2/3 width on desktop) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Service Health Grid Component */}
          <ServiceHealthGrid services={MOCK_SERVICES} />

          {/* Deployment Activity Stream Component */}
          <DeploymentActivityFeed deployments={MOCK_DEPLOYMENTS} />
        </div>

        {/* Right Column (1/3 width on desktop) */}
        <div className="space-y-6">
          {/* Active Incidents Panel Component */}
          <ActiveIncidentsPanel incidents={MOCK_INCIDENTS} onOpenRoom={handleOpenRoom} />
        </div>
      </div>
    </AppShell>
  );
}
