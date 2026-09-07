import React from "react";
import { ServiceHealth } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Server, Activity, ShieldCheck, Cpu, Terminal, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceOverviewTabProps {
  service: ServiceHealth;
}

export const ServiceOverviewTab: React.FC<ServiceOverviewTabProps> = ({ service }) => {
  return (
    <div className="space-y-6">
      {/* SLA & Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-400">
            Target SLA Uptime
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold text-slate-50">{service.uptimePercentage}%</span>
            <span className="text-xs font-mono text-emerald-400">SLA: {service.slaTargetPercentage || 99.9}%</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-mono">0.01% below 30-day target window</p>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-400">
            Latency p99 / p95
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold text-slate-50">{service.latencyP99Ms}ms</span>
            <span className="text-xs font-mono text-slate-400">p95: {service.latencyP95Ms}ms</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-mono">Calculated across last 100k requests</p>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-400">
            Error Rate
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span
              className={cn(
                "font-mono text-2xl font-bold",
                service.errorRatePercentage > 5.0 ? "text-red-400" : service.errorRatePercentage > 1.0 ? "text-amber-400" : "text-emerald-400"
              )}
            >
              {service.errorRatePercentage.toFixed(2)}%
            </span>
            <span className="text-xs font-mono text-slate-400">HTTP 5xx</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-mono">Threshold: 1.0% alert baseline</p>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-400">
            Throughput (RPS)
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold text-slate-50">{service.requestRateRps}</span>
            <span className="text-xs font-mono text-slate-400">req/sec</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-mono">Peak hour capacity: 5,000 rps</p>
        </Card>
      </div>

      {/* Endpoints & Runtime Specifications */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Endpoints Table (2/3 width) */}
        <Card variant="default" className="lg:col-span-2">
          <CardHeader className="border-b border-slate-800/80 pb-3">
            <CardTitle className="text-sm font-mono flex items-center gap-2">
              <Terminal className="h-4 w-4 text-brand-light" />
              Exposed API Endpoints ({service.endpoints?.length || 0})
            </CardTitle>
            <CardDescription>Active HTTP endpoints monitored by Aegis probes</CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {(!service.endpoints || service.endpoints.length === 0) ? (
              <div className="p-6 text-center text-xs text-slate-500 font-mono">
                No active REST API endpoints registered for this service node.
              </div>
            ) : (
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-2.5">Method</th>
                    <th className="px-4 py-2.5">Path</th>
                    <th className="px-4 py-2.5">p99 Latency</th>
                    <th className="px-4 py-2.5">Error Rate</th>
                    <th className="px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {service.endpoints.map((ep, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="px-4 py-2.5">
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 font-mono text-[10px] font-bold",
                            ep.method === "GET" && "bg-blue-950 text-blue-400 border border-blue-800/40",
                            ep.method === "POST" && "bg-emerald-950 text-emerald-400 border border-emerald-800/40",
                            ep.method === "DELETE" && "bg-red-950 text-red-400 border border-red-800/40"
                          )}
                        >
                          {ep.method}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-bold text-slate-200">{ep.path}</td>
                      <td className="px-4 py-2.5 text-slate-300">{ep.p99LatencyMs}ms</td>
                      <td className="px-4 py-2.5 text-slate-300">{ep.errorRatePercentage}%</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-[10px] font-semibold capitalize",
                            ep.status === "nominal" && "text-emerald-400",
                            ep.status === "degraded" && "text-amber-400",
                            ep.status === "failing" && "text-red-400"
                          )}
                        >
                          <span className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            ep.status === "nominal" && "bg-emerald-400",
                            ep.status === "degraded" && "bg-amber-400",
                            ep.status === "failing" && "bg-red-400 animate-ping"
                          )} />
                          {ep.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Runtime Environment Info Card (1/3 width) */}
        <Card variant="default">
          <CardHeader className="border-b border-slate-800/80 pb-3">
            <CardTitle className="text-sm font-mono flex items-center gap-2">
              <Cpu className="h-4 w-4 text-brand-light" />
              Runtime Specifications
            </CardTitle>
            <CardDescription>Infrastructure & deployment environment</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 text-[10px] block">Framework & Runtime</span>
              <span className="text-slate-200 font-semibold">{service.framework || "Node.js 20"}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 text-[10px] block">Cloud Host / Environment</span>
              <span className="text-slate-200 font-semibold">{service.runtimeEnv || "AWS ECS Fargate"}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 text-[10px] block">Owner Team</span>
              <span className="text-slate-200 font-semibold">{service.ownerTeam}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 text-[10px] block">Source Repository</span>
              <a
                href={service.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="text-brand-light hover:underline flex items-center gap-1 text-xs truncate"
              >
                {service.repositoryUrl} <ArrowUpRight className="h-3 w-3 shrink-0" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
