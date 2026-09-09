import React from "react";
import Link from "next/link";
import { Deployment } from "@/types/domain";
import { ArrowRight, GitCommit, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeploymentTableProps {
  deployments: Deployment[];
}

export const DeploymentTable: React.FC<DeploymentTableProps> = ({ deployments }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-800 bg-surface">
      <table className="w-full text-left font-mono text-xs">
        <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Commit</th>
            <th className="px-4 py-3">Env</th>
            <th className="px-4 py-3">Risk Score</th>
            <th className="px-4 py-3">Author</th>
            <th className="px-4 py-3">Deployed At</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {deployments.map((dep) => {
            const isHighRisk = dep.riskLevel === "HIGH";
            const isMediumRisk = dep.riskLevel === "MEDIUM";

            return (
              <tr key={dep.id} className="group hover:bg-slate-900/60 transition-colors">
                <td className="px-4 py-3.5 font-bold text-slate-200 whitespace-nowrap">
                  {dep.serviceName}
                </td>

                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <GitCommit className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <div>
                      <span className="font-bold text-brand-light">[{dep.commitSha}]</span>
                      <span className="text-[11px] text-slate-400 font-sans line-clamp-1">
                        {dep.commitMessage}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                    {dep.environment}
                  </span>
                </td>

                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span
                    className={cn(
                      "font-bold text-xs inline-flex items-center gap-1",
                      isHighRisk && "text-red-400",
                      isMediumRisk && "text-amber-400",
                      !isHighRisk && !isMediumRisk && "text-emerald-400"
                    )}
                  >
                    {isHighRisk && <AlertTriangle className="h-3 w-3" />}
                    {!isHighRisk && <ShieldCheck className="h-3 w-3" />}
                    {dep.riskScore}/100 ({dep.riskLevel})
                  </span>
                </td>

                <td className="px-4 py-3.5 whitespace-nowrap text-slate-300 text-[11px]">
                  {dep.author.name}
                </td>

                <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                  {dep.deployedAt}
                </td>

                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span
                    className={cn(
                      "rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      dep.status === "failed" && "bg-red-950 text-red-400 border border-red-800/40",
                      dep.status === "success" && "bg-emerald-950 text-emerald-400 border border-emerald-800/40",
                      dep.status === "rolled_back" && "bg-amber-950 text-amber-300 border border-amber-800/40"
                    )}
                  >
                    {dep.status}
                  </span>
                </td>

                <td className="px-4 py-3.5 whitespace-nowrap text-right">
                  <Link
                    href={`/deployments/${dep.id}`}
                    className="inline-flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-brand hover:text-white transition-colors"
                  >
                    Risk Audit <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
