"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { ServiceHealthGrid } from "@/components/dashboard/ServiceHealthGrid";
import { ActiveIncidentsPanel } from "@/components/dashboard/ActiveIncidentsPanel";
import { DeploymentActivityFeed } from "@/components/dashboard/DeploymentActivityFeed";
import { TelemetrySparkline } from "@/components/dashboard/TelemetrySparkline";
import { LiveEventBanner } from "@/components/common/LiveEventBanner";
import { WsConnectionBadge } from "@/components/common/WsConnectionBadge";
import { Button } from "@/components/ui/Button";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import {
  MOCK_SERVICES,
  MOCK_INCIDENTS,
  MOCK_DEPLOYMENTS,
} from "@/mocks";
import { Incident } from "@/types/domain";
import {
  Server,
  AlertTriangle,
  GitCommit,
  Clock,
  RefreshCw,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OverviewDashboardPage() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const { summary, telemetry: initialTelemetry, isLive, refetch } = useDashboardMetrics();
  const { latestTick, wsStatus } = useRealtimeEvents();

  const [telemetrySeries, setTelemetrySeries] = useState(initialTelemetry);

  useEffect(() => {
    if (latestTick) {
      setTelemetrySeries((prev) => {
        const next = [...prev, latestTick];
        return next.slice(-12);
      });
    }
  }, [latestTick]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch();
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
    <AppShell isLive={isLive}>
      {/* Toast Notification Banner */}
      {activeToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-brand/40 bg-surface/95 px-4 py-3 shadow-2xl backdrop-blur-md font-mono text-xs text-slate-100">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{activeToast}</span>
        </div>
      )}

      {/* Realtime Incident Alert Banner */}
      <LiveEventBanner
        code="INC-8492"
        severity="SEV1"
        title="Payment Checkout 500 Error Spike & Connection Pool Exhaustion"
        description="Elevated 500 error rates on payment checkout processing endpoint post v2.4.1 deployment."
        incidentUrl="/incidents/inc-101"
      />

      {/* Page Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-xl font-bold text-slate-100 tracking-tight">
              Reliability & Operations
            </h1>
            <span className="rounded bg-brand/10 border border-brand/20 px-2 py-0.5 font-mono text-[10px] text-brand-light">
              LIVE TELEMETRY
            </span>
            <WsConnectionBadge status={wsStatus} />
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

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="text-xs font-mono text-slate-300 border-slate-800 hover:bg-slate-800"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5 text-slate-400", isRefreshing && "animate-spin")} />
            Sync
          </Button>
        </div>
      </div>

      {/* 2. Key Operational Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="SERVICES HEALTHY"
          value={`${summary.healthyServicesCount}/${summary.totalServices}`}
          change={`${summary.degradedServicesCount} Degraded, ${summary.criticalServicesCount} Critical`}
          changeType={summary.criticalServicesCount > 0 ? "negative" : "neutral"}
          icon={Server}
          subtitle="System Uptime: 99.82%"
        />
        <MetricCard
          title="ACTIVE INCIDENTS"
          value={summary.activeIncidentsCount}
          change={`${summary.sev1IncidentsCount} SEV1 Critical`}
          changeType="negative"
          icon={AlertTriangle}
          subtitle="Avg Response: 4.2 mins"
        />
        <MetricCard
          title="DEPLOYMENTS (24H)"
          value={summary.deployments24hCount}
          change={`${summary.deploymentSuccessRatePercentage}% Success Rate`}
          changeType="positive"
          icon={GitCommit}
          subtitle="1 Failed (Rolled Back)"
        />
        <MetricCard
          title="MTTR (MEAN TIME TO RESOLVE)"
          value={`${summary.mttrMinutes}m`}
          change={`${summary.mttrChangePercentage}% vs last week`}
          changeType="positive"
          icon={Clock}
          subtitle="Target SLA: <25.0m"
        />
      </div>

      {/* 3. Telemetry Sparkline & Real-time Traffic */}
      <div className="w-full">
        <TelemetrySparkline data={telemetrySeries} />
      </div>

      {/* 4. Service Health Grid */}
      <ServiceHealthGrid services={MOCK_SERVICES} />

      {/* 5. Incidents & Deployments Activity Feed Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ActiveIncidentsPanel incidents={MOCK_INCIDENTS} onOpenRoom={handleOpenRoom} />
        </div>
        <div className="lg:col-span-5">
          <DeploymentActivityFeed deployments={MOCK_DEPLOYMENTS} />
        </div>
      </div>
    </AppShell>
  );
}
