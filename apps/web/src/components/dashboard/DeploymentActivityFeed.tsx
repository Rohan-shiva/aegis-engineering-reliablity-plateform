"use client";

import React, { useState } from "react";
import { Deployment } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { GitCommit, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeploymentActivityFeedProps {
  deployments: Deployment[];
}

export const DeploymentActivityFeed: React.FC<DeploymentActivityFeedProps> = ({
  deployments,
}) => {
  const [expandedDeploymentId, setExpandedDeploymentId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedDeploymentId((prev) => (prev === id ? null : id));
  };

  return (
    <Card variant="default">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <CardTitle className="text-sm font-mono flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-emerald-400" />
            Deployment Risk Stream ({deployments.length})
          </CardTitle>
          <CardDescription>
            Deterministic risk scoring and automated change impact signals
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-4 space-y-3">
        {deployments.map((dep) => {
          const isExpanded = expandedDeploymentId === dep.id;
          const isHighRisk = dep.riskLevel === "HIGH";
          const isMediumRisk = dep.riskLevel === "MEDIUM";

          return (
            <div
              key={dep.id}
              className={cn(
                "rounded-lg border bg-slate-900/40 p-3.5 transition-all duration-150 font-mono text-xs",
                isHighRisk && "border-red-900/40 bg-red-950/10",
                isMediumRisk && "border-amber-900/30 bg-amber-950/10",
                !isHighRisk && !isMediumRisk && "border-slate-800/80"
              )}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                {/* Left metadata */}
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                      isHighRisk && "border-red-600/40 bg-red-950/50 text-red-400",
                      isMediumRisk && "border-amber-600/40 bg-amber-950/50 text-amber-400",
                      !isHighRisk && !isMediumRisk && "border-slate-700 bg-slate-800 text-slate-300"
                    )}
                  >
                    <GitCommit className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-100">{dep.serviceName}</span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-semibold">
                        {dep.environment}
                      </span>
                      <span className="text-slate-500 text-[11px]">[{dep.commitSha}]</span>
                    </div>

                    <p className="text-[11px] text-slate-400 font-sans mt-0.5 line-clamp-1">
                      {dep.commitMessage}
                    </p>

                    <div className="mt-1 flex items-center gap-3 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-slate-600" />
                        {dep.author.name}
                      </span>
                      <span>•</span>
                      <span>{dep.deployedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Right Risk Pill & Toggle */}
                <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-slate-800/60 pt-2 sm:border-t-0 sm:pt-0">
                  <div
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1 font-bold text-xs",
                      isHighRisk && "border-red-500/40 bg-red-500/10 text-red-400",
                      isMediumRisk && "border-amber-500/40 bg-amber-500/10 text-amber-400",
                      !isHighRisk && !isMediumRisk && "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    )}
                  >
                    {isHighRisk && <AlertTriangle className="h-3.5 w-3.5" />}
                    {!isHighRisk && <ShieldCheck className="h-3.5 w-3.5" />}
                    <span>Risk: {dep.riskScore}/100</span>
                    <span className="text-[10px] uppercase font-mono">({dep.riskLevel})</span>
                  </div>

                  <button
                    onClick={() => toggleExpand(dep.id)}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200"
                  >
                    <span>Signals ({dep.riskFactors.length})</span>
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              {/* Risk Factors Expandable Panel */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-1.5">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Automated Risk Signals Detected:
                  </span>
                  <ul className="space-y-1 pl-2">
                    {dep.riskFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[11px] text-slate-300 font-sans">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-600 shrink-0" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
