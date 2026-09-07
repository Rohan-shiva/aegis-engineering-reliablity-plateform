import React from "react";
import Link from "next/link";
import { ServiceHealth } from "@/types/domain";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ArrowUpRight, Server, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceTableProps {
  services: ServiceHealth[];
}

export const ServiceTable: React.FC<ServiceTableProps> = ({ services }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-800 bg-surface">
      <table className="w-full text-left font-mono text-xs">
        <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Env</th>
            <th className="px-4 py-3">p99 Latency</th>
            <th className="px-4 py-3">Error Rate</th>
            <th className="px-4 py-3">RPS</th>
            <th className="px-4 py-3">Owner Team</th>
            <th className="px-4 py-3">Last Deployed</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {services.map((service) => (
            <tr
              key={service.id}
              className="group hover:bg-slate-900/60 transition-colors"
            >
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-slate-500 group-hover:text-brand" />
                  <div>
                    <Link
                      href={`/services/${service.id}`}
                      className="font-bold text-slate-200 group-hover:text-brand-light transition-colors"
                    >
                      {service.name}
                    </Link>
                    <span className="text-[10px] text-slate-500 block truncate max-w-xs font-sans">
                      {service.framework || service.description}
                    </span>
                  </div>
                </div>
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap">
                <StatusBadge status={service.status} size="sm" />
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                  {service.environment}
                </span>
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap">
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
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap">
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
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap text-slate-300">
                {service.requestRateRps} rps
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                {service.ownerTeam}
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                {service.lastDeployedAt}
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap text-right">
                <Link
                  href={`/services/${service.id}`}
                  className="inline-flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-brand hover:text-white transition-colors"
                >
                  Details <ArrowUpRight className="h-3 w-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
