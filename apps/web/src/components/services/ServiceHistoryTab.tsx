import React from "react";
import { ServiceHealth } from "@/types/domain";
import { MOCK_DEPLOYMENTS, MOCK_INCIDENTS } from "@/mocks";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { GitCommit, AlertTriangle, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceHistoryTabProps {
  service: ServiceHealth;
}

export const ServiceHistoryTab: React.FC<ServiceHistoryTabProps> = ({ service }) => {
  const serviceDeployments = MOCK_DEPLOYMENTS.filter(
    (d) => d.serviceId === service.id || d.serviceName === service.name
  );
  const serviceIncidents = MOCK_INCIDENTS.filter((inc) =>
    inc.affectedServices.includes(service.name) || inc.affectedServices.includes(service.id)
  );

  return (
    <div className="space-y-6">
      {/* 1. Deployment History Table */}
      <Card variant="default">
        <CardHeader className="border-b border-slate-800/80 pb-3">
          <CardTitle className="text-sm font-mono flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-emerald-400" />
            Service Deployment History ({serviceDeployments.length})
          </CardTitle>
          <CardDescription>Recent production and staging deployment events</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {serviceDeployments.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 font-mono">
              No recent deployment activity records logged for this service.
            </div>
          ) : (
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-[10px] uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-2.5">Commit</th>
                  <th className="px-4 py-2.5">Env</th>
                  <th className="px-4 py-2.5">Author</th>
                  <th className="px-4 py-2.5">Risk Score</th>
                  <th className="px-4 py-2.5">Deployed At</th>
                  <th className="px-4 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {serviceDeployments.map((dep) => (
                  <tr key={dep.id} className="hover:bg-slate-900/40">
                    <td className="px-4 py-2.5">
                      <span className="font-bold text-slate-200 block">[{dep.commitSha}]</span>
                      <span className="text-[11px] text-slate-400 font-sans line-clamp-1">
                        {dep.commitMessage}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                        {dep.environment}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-slate-300">
                      {dep.author.name}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className={cn(
                          "font-bold text-xs",
                          dep.riskLevel === "HIGH" && "text-red-400",
                          dep.riskLevel === "MEDIUM" && "text-amber-400",
                          dep.riskLevel === "LOW" && "text-emerald-400"
                        )}
                      >
                        {dep.riskScore}/100 ({dep.riskLevel})
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-slate-400 text-[11px]">
                      {dep.deployedAt}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-right">
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                          dep.status === "failed" && "bg-red-950 text-red-400 border border-red-800/40",
                          dep.status === "success" && "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                        )}
                      >
                        {dep.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* 2. Linked Operational Incidents */}
      <Card variant="default">
        <CardHeader className="border-b border-slate-800/80 pb-3">
          <CardTitle className="text-sm font-mono flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-4 w-4" />
            Linked Production Incidents ({serviceIncidents.length})
          </CardTitle>
          <CardDescription>Historical and active incident reports affecting this service</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {serviceIncidents.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 font-mono">
              No linked production incidents recorded for this service.
            </div>
          ) : (
            serviceIncidents.map((inc) => (
              <div
                key={inc.id}
                className="flex items-center justify-between p-3.5 rounded-lg border border-red-900/40 bg-red-950/20 font-mono text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={inc.severity} />
                    <span className="font-bold text-slate-200">{inc.code} — {inc.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans line-clamp-1">{inc.summary}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{inc.createdAt}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
