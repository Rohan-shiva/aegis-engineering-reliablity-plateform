import React from "react";
import Link from "next/link";
import { ServiceHealth } from "@/types/domain";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Server, ArrowUpRight, Cpu, GitBranch, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: ServiceHealth;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const isCritical = service.status === "critical";
  const isDegraded = service.status === "degraded";

  return (
    <Card
      variant="hover"
      className={cn(
        "flex flex-col justify-between p-4 relative transition-all duration-200 group border",
        isCritical && "border-red-900/50 bg-red-950/10 hover:border-red-600/60",
        isDegraded && "border-amber-900/50 bg-amber-950/10 hover:border-amber-600/60",
        !isCritical && !isDegraded && "border-slate-800/80 bg-slate-900/40"
      )}
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Link
              href={`/services/${service.id}`}
              className="font-mono text-sm font-bold text-slate-100 group-hover:text-brand-light transition-colors flex items-center gap-1.5"
            >
              <Server className="h-4 w-4 text-slate-400 group-hover:text-brand" />
              <span>{service.name}</span>
              <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-light" />
            </Link>
            <p className="text-xs text-slate-400 line-clamp-2">{service.description}</p>
          </div>

          <StatusBadge status={service.status} size="sm" />
        </div>

        {/* Framework & Runtime Metadata */}
        <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] text-slate-400">
          <span className="rounded bg-slate-800/80 px-2 py-0.5 border border-slate-700/50">
            {service.framework || "Node.js"}
          </span>
          <span className="rounded bg-slate-800/80 px-2 py-0.5 border border-slate-700/50">
            {service.runtimeEnv || "AWS ECS"}
          </span>
          {service.activeIncidentsCount > 0 && (
            <span className="rounded bg-red-950/80 border border-red-800/60 text-red-400 px-2 py-0.5 flex items-center gap-1 font-bold">
              <AlertTriangle className="h-3 w-3" />
              {service.activeIncidentsCount} Incident
            </span>
          )}
        </div>
      </div>

      {/* Telemetry Metrics Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-2">
        <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
          <div>
            <span className="text-slate-500 block text-[10px]">p99 Latency</span>
            <span
              className={cn(
                "font-semibold",
                service.latencyP99Ms > 500
                  ? "text-red-400"
                  : service.latencyP99Ms > 150
                  ? "text-amber-400"
                  : "text-slate-200"
              )}
            >
              {service.latencyP99Ms}ms
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Error Rate</span>
            <span
              className={cn(
                "font-semibold",
                service.errorRatePercentage > 5.0
                  ? "text-red-400"
                  : service.errorRatePercentage > 1.0
                  ? "text-amber-400"
                  : "text-emerald-400"
              )}
            >
              {service.errorRatePercentage.toFixed(2)}%
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Uptime SLA</span>
            <span className="text-slate-200 font-semibold">{service.uptimePercentage}%</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3 text-slate-600" />
            {service.ownerTeam}
          </span>
          <span>Deployed {service.lastDeployedAt}</span>
        </div>
      </div>
    </Card>
  );
};
