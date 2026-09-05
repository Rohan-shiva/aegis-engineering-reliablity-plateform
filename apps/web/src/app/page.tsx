import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Server,
  AlertTriangle,
  GitCommit,
  Clock,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Bot,
  Activity,
} from "lucide-react";

export default function OverviewDashboardPage() {
  return (
    <AppShell>
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
            <button className="px-2 py-1 rounded text-slate-200 bg-slate-800 font-semibold">24h</button>
            <button className="px-2 py-1 rounded hover:text-slate-200">7d</button>
            <button className="px-2 py-1 rounded hover:text-slate-200">30d</button>
          </div>

          <Button variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* 2. Key Reliability Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Monitored Services"
          value="12"
          change="10 Healthy"
          changeType="positive"
          subtitle="• 1 Degraded, 1 Critical"
          icon={Server}
          iconColor="text-blue-400"
        />
        <MetricCard
          title="Active Incidents"
          value="2"
          change="SEV-1 Active"
          changeType="negative"
          subtitle="• payment-gateway degraded"
          icon={AlertTriangle}
          iconColor="text-red-400"
        />
        <MetricCard
          title="Deployments Today"
          value="18"
          change="+14%"
          changeType="positive"
          subtitle="• 94.4% success rate"
          icon={GitCommit}
          iconColor="text-emerald-400"
        />
        <MetricCard
          title="Mean Time To Resolve"
          value="18.4m"
          change="-12.3%"
          changeType="positive"
          subtitle="• 3.2m faster than target"
          icon={Clock}
          iconColor="text-amber-400"
        />
      </div>

      {/* 3. Main Operational Sections Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2/3 width on desktop) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Service Health Grid Container Shell */}
          <Card variant="default">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                  <Server className="h-4 w-4 text-brand-light" />
                  Service Health Matrix
                </CardTitle>
                <CardDescription>
                  High-level status for core microservices and infrastructure dependencies
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-brand-light gap-1">
                View All <ArrowUpRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Mock Service Items */}
                {[
                  { name: "auth-service", status: "healthy" as const, latency: "42ms", uptime: "99.99%" },
                  { name: "payment-gateway", status: "critical" as const, latency: "1420ms", uptime: "98.20%" },
                  { name: "order-processor", status: "degraded" as const, latency: "280ms", uptime: "99.50%" },
                  { name: "notification-worker", status: "healthy" as const, latency: "18ms", uptime: "99.95%" },
                ].map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-800/80 bg-slate-900/40 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="font-mono text-xs font-semibold text-slate-200">
                        {service.name}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span>p99: {service.latency}</span>
                        <span>•</span>
                        <span>{service.uptime} uptime</span>
                      </div>
                    </div>
                    <StatusBadge status={service.status} size="sm" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deployment Stream Container Shell */}
          <Card variant="default">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-emerald-400" />
                  Recent Deployment Stream
                </CardTitle>
                <CardDescription>
                  Automated deployments across staging and production clusters
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-4 space-y-3">
              {[
                {
                  service: "payment-gateway",
                  env: "PROD",
                  commit: "a8f9c1d",
                  author: "alex.dev",
                  time: "14 mins ago",
                  risk: "82/100 (HIGH RISK)",
                  riskType: "critical",
                },
                {
                  service: "auth-service",
                  env: "STAGING",
                  commit: "f3e2b10",
                  author: "sarah.m",
                  time: "42 mins ago",
                  risk: "14/100 (LOW RISK)",
                  riskType: "healthy",
                },
              ].map((dep, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-md border border-slate-800/60 bg-slate-900/30 text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-800 text-slate-400">
                      <GitCommit className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">{dep.service}</span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                          {dep.env}
                        </span>
                        <span className="text-slate-500">[{dep.commit}]</span>
                      </div>
                      <span className="text-[10px] text-slate-500">by {dep.author} • {dep.time}</span>
                    </div>
                  </div>
                  <span
                    className={
                      dep.riskType === "critical"
                        ? "text-red-400 font-semibold"
                        : "text-emerald-400 font-medium"
                    }
                  >
                    {dep.risk}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3 width on desktop) */}
        <div className="space-y-6">
          {/* Active Incidents Container */}
          <Card variant="default" className="border-red-900/30 bg-red-950/10">
            <CardHeader className="border-b border-red-900/20 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-mono flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                  Active Incidents (2)
                </CardTitle>
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              </div>
              <CardDescription>Unresolved operational anomalies requiring intervention</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-4 space-y-3">
              <div className="p-3 rounded-md border border-red-900/40 bg-red-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <SeverityBadge severity="SEV-1" />
                  <span className="text-[10px] font-mono text-slate-400">INC-8492</span>
                </div>
                <h4 className="font-semibold text-xs text-slate-100">
                  High Error Rate on Payment Checkout API
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  500 Internal Error spike reaching 14.2% following deployment a8f9c1d.
                </p>
                <div className="pt-1 flex items-center justify-between border-t border-red-900/30 text-[10px] font-mono text-slate-400">
                  <span>Opened 18m ago</span>
                  <span className="text-brand-light hover:underline cursor-pointer">Enter Incident Room →</span>
                </div>
              </div>

              <div className="p-3 rounded-md border border-amber-900/40 bg-amber-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <SeverityBadge severity="SEV-3" />
                  <span className="text-[10px] font-mono text-slate-400">INC-8490</span>
                </div>
                <h4 className="font-semibold text-xs text-slate-100">
                  Order Processing Queue Lag
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  BullMQ queue depth exceeded 45k items. Consumer latency degraded.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Investigator Assistant Widget */}
          <Card variant="bordered" className="bg-slate-900/40 border-brand/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono flex items-center gap-2 text-brand-light">
                <Bot className="h-4 w-4 text-brand" />
                Aegis AI Investigator
              </CardTitle>
              <CardDescription>Autonomous incident root-cause analysis</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <div className="rounded-md border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                  <Activity className="h-3 w-3 animate-spin" />
                  Active Analysis on INC-8492
                </div>
                <p className="text-[11px] text-slate-400">
                  "Correlation detected between DB query schema update in commit a8f9c1d and payment-gateway 500 error spike."
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Confidence: 89%</span>
                  <span className="text-brand-light">3 evidence tools queried</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
