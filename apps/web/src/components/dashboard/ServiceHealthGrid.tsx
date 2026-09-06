"use client";

import React, { useState } from "react";
import { ServiceHealth } from "@/types/domain";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Search, Server, ArrowUpRight, Activity, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceHealthGridProps {
  services: ServiceHealth[];
  onSelectService?: (service: ServiceHealth) => void;
}

export const ServiceHealthGrid: React.FC<ServiceHealthGridProps> = ({
  services,
  onSelectService,
}) => {
  const [filterStatus, setFilterStatus] = useState<StatusType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter((service) => {
    const matchesStatus = filterStatus === "all" || service.status === filterStatus;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.ownerTeam.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const countByStatus = {
    all: services.length,
    healthy: services.filter((s) => s.status === "healthy").length,
    degraded: services.filter((s) => s.status === "degraded").length,
    critical: services.filter((s) => s.status === "critical").length,
    unknown: services.filter((s) => s.status === "unknown").length,
  };

  return (
    <Card variant="default">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-3">
        <div>
          <CardTitle className="text-sm font-mono flex items-center gap-2">
            <Server className="h-4 w-4 text-brand-light" />
            Service Health Matrix ({filteredServices.length})
          </CardTitle>
          <CardDescription>
            Live health telemetry, response latency, and error rates across registered services
          </CardDescription>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Tabs */}
          <div className="flex items-center rounded-md border border-slate-800 bg-slate-950/60 p-1 font-mono text-xs">
            <button
              onClick={() => setFilterStatus("all")}
              className={cn(
                "rounded px-2.5 py-1 transition-colors",
                filterStatus === "all" ? "bg-slate-800 text-slate-100 font-semibold" : "text-slate-400 hover:text-slate-200"
              )}
            >
              All ({countByStatus.all})
            </button>
            <button
              onClick={() => setFilterStatus("healthy")}
              className={cn(
                "rounded px-2.5 py-1 transition-colors",
                filterStatus === "healthy" ? "bg-emerald-950/80 text-emerald-400 font-semibold" : "text-slate-400 hover:text-emerald-400"
              )}
            >
              Healthy ({countByStatus.healthy})
            </button>
            <button
              onClick={() => setFilterStatus("degraded")}
              className={cn(
                "rounded px-2.5 py-1 transition-colors",
                filterStatus === "degraded" ? "bg-amber-950/80 text-amber-400 font-semibold" : "text-slate-400 hover:text-amber-400"
              )}
            >
              Degraded ({countByStatus.degraded})
            </button>
            <button
              onClick={() => setFilterStatus("critical")}
              className={cn(
                "rounded px-2.5 py-1 transition-colors",
                filterStatus === "critical" ? "bg-red-950/80 text-red-400 font-semibold" : "text-slate-400 hover:text-red-400"
              )}
            >
              Critical ({countByStatus.critical})
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter services..."
              className="w-36 sm:w-44 rounded-md border border-slate-800 bg-slate-950/60 py-1 pl-8 pr-2.5 font-mono text-xs text-slate-200 placeholder-slate-500 focus:border-brand/60 focus:outline-none"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-4">
        {filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-800 rounded-lg">
            <Server className="h-8 w-8 text-slate-600 mb-2" />
            <p className="font-mono text-xs text-slate-400">No services match the selected filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => onSelectService?.(service)}
                className={cn(
                  "group relative flex flex-col justify-between p-3.5 rounded-lg border bg-slate-900/40 transition-all duration-150 cursor-pointer hover:border-slate-700 hover:bg-slate-900/80",
                  service.status === "critical" && "border-red-900/40 bg-red-950/10 hover:border-red-600/50",
                  service.status === "degraded" && "border-amber-900/40 bg-amber-950/10 hover:border-amber-600/50",
                  service.status === "healthy" && "border-slate-800/80"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-100 group-hover:text-brand-light transition-colors">
                        {service.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">[{service.environment}]</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{service.description}</p>
                  </div>
                  <StatusBadge status={service.status} size="sm" />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-800/60 font-mono text-[10px]">
                  <div>
                    <span className="text-slate-500 block">p99 Latency</span>
                    <span className={cn(
                      "font-semibold",
                      service.latencyP99Ms > 500 ? "text-red-400" : service.latencyP99Ms > 150 ? "text-amber-400" : "text-slate-200"
                    )}>
                      {service.latencyP99Ms}ms
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Error Rate</span>
                    <span className={cn(
                      "font-semibold",
                      service.errorRatePercentage > 5.0 ? "text-red-400" : service.errorRatePercentage > 1.0 ? "text-amber-400" : "text-emerald-400"
                    )}>
                      {service.errorRatePercentage.toFixed(2)}%
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Throughput</span>
                    <span className="text-slate-200 font-semibold">{service.requestRateRps} rps</span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Cpu className="h-3 w-3 text-slate-600" />
                    {service.ownerTeam}
                  </span>
                  <span className="text-slate-400 group-hover:text-slate-200 transition-colors flex items-center gap-0.5">
                    Deployed {service.lastDeployedAt} <ArrowUpRight className="h-2.5 w-2.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
