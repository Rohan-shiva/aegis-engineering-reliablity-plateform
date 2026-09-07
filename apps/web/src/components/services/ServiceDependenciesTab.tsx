import React from "react";
import Link from "next/link";
import { ServiceHealth } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Network, ArrowRight, ArrowLeft, Database, Server, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceDependenciesTabProps {
  service: ServiceHealth;
}

export const ServiceDependenciesTab: React.FC<ServiceDependenciesTabProps> = ({ service }) => {
  const upstreams = service.upstreamDependencies || [];
  const downstreams = service.downstreamDependencies || [];

  return (
    <div className="space-y-6">
      <Card variant="default">
        <CardHeader className="border-b border-slate-800/80 pb-3">
          <CardTitle className="text-sm font-mono flex items-center gap-2">
            <Network className="h-4 w-4 text-brand-light" />
            Service Dependency Graph Topology
          </CardTitle>
          <CardDescription>
            Visual map of upstream callers and downstream service dependencies (blast radius analysis)
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* 1. Upstream Callers Column */}
            <div className="flex-1 space-y-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
                Upstream Callers ({upstreams.length})
              </span>

              {upstreams.length === 0 ? (
                <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-4 text-center font-mono text-xs text-slate-500">
                  No registered upstream services calling this node.
                </div>
              ) : (
                <div className="space-y-2">
                  {upstreams.map((dep) => (
                    <div
                      key={dep.serviceId}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-3 font-mono text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-slate-400" />
                        <div>
                          <Link href={`/services/${dep.serviceId}`} className="font-bold text-slate-200 hover:text-brand-light">
                            {dep.serviceName}
                          </Link>
                          <span className="text-[10px] text-slate-500 block">via {dep.protocol}</span>
                        </div>
                      </div>
                      <StatusBadge status={dep.healthStatus} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Current Central Service Node */}
            <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-brand/60 bg-slate-900/90 shadow-xl shadow-brand/5 shrink-0 my-2 lg:my-0 lg:w-64 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/20 text-brand-light border border-brand/40 mb-2">
                <Server className="h-5 w-5" />
              </div>
              <span className="font-mono text-sm font-bold text-slate-100">{service.name}</span>
              <span className="font-mono text-[10px] text-slate-400 mt-0.5">[{service.environment}]</span>
              <div className="mt-3">
                <StatusBadge status={service.status} size="sm" />
              </div>
              <span className="font-mono text-[10px] text-slate-500 mt-2">p99: {service.latencyP99Ms}ms • {service.errorRatePercentage.toFixed(2)}% err</span>
            </div>

            {/* 3. Downstream Dependencies Column */}
            <div className="flex-1 space-y-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
                Downstream Dependencies ({downstreams.length})
              </span>

              {downstreams.length === 0 ? (
                <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-4 text-center font-mono text-xs text-slate-500">
                  No downstream dependencies registered for this service node.
                </div>
              ) : (
                <div className="space-y-2">
                  {downstreams.map((dep) => (
                    <div
                      key={dep.serviceId}
                      className={cn(
                        "flex items-center justify-between rounded-lg border p-3 font-mono text-xs transition-colors",
                        dep.healthStatus === "critical" ? "border-red-900/50 bg-red-950/20" : "border-slate-800 bg-slate-900/60"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {dep.protocol === "MongoDB" || dep.protocol === "Redis" ? (
                          <Database className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Server className="h-4 w-4 text-slate-400" />
                        )}
                        <div>
                          <Link href={`/services/${dep.serviceId}`} className="font-bold text-slate-200 hover:text-brand-light">
                            {dep.serviceName}
                          </Link>
                          <span className="text-[10px] text-slate-500 block">via {dep.protocol} ({dep.avgLatencyMs}ms)</span>
                        </div>
                      </div>
                      <StatusBadge status={dep.healthStatus} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
