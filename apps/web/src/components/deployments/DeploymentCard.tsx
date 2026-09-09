import React from "react";
import Link from "next/link";
import { Deployment } from "@/types/domain";
import { Card } from "@/components/ui/Card";
import { GitCommit, AlertTriangle, ShieldCheck, User, Clock, ArrowRight, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeploymentCardProps {
  deployment: Deployment;
}

export const DeploymentCard: React.FC<DeploymentCardProps> = ({ deployment }) => {
  const isHighRisk = deployment.riskLevel === "HIGH";
  const isMediumRisk = deployment.riskLevel === "MEDIUM";

  return (
    <Card
      variant="hover"
      className={cn(
        "flex flex-col justify-between p-4 relative transition-all duration-200 group border font-mono text-xs",
        isHighRisk && "border-red-900/60 bg-red-950/15 hover:border-red-600/70",
        isMediumRisk && "border-amber-900/50 bg-amber-950/15 hover:border-amber-600/60",
        !isHighRisk && !isMediumRisk && "border-slate-800/80 bg-slate-900/40"
      )}
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100">{deployment.serviceName}</span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-semibold">
              {deployment.environment}
            </span>
            <span className="text-slate-500 text-[11px]">[{deployment.commitSha}]</span>
          </div>

          <div
            className={cn(
              "flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-bold text-[10px]",
              isHighRisk && "border-red-500/40 bg-red-500/10 text-red-400",
              isMediumRisk && "border-amber-500/40 bg-amber-500/10 text-amber-400",
              !isHighRisk && !isMediumRisk && "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
            )}
          >
            {isHighRisk && <AlertTriangle className="h-3 w-3" />}
            {!isHighRisk && <ShieldCheck className="h-3 w-3" />}
            <span>Risk: {deployment.riskScore}/100</span>
          </div>
        </div>

        {/* Commit Message */}
        <div className="mt-3 space-y-1">
          <Link
            href={`/deployments/${deployment.id}`}
            className="font-mono text-xs font-bold text-slate-200 group-hover:text-brand-light transition-colors line-clamp-2 flex items-center justify-between"
          >
            <span className="font-sans leading-snug">{deployment.commitMessage}</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-brand-light ml-2" />
          </Link>
        </div>

        {/* Risk Signals summary */}
        {deployment.riskFactors && deployment.riskFactors.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-800/60 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Risk Signals:</span>
            <ul className="space-y-0.5 text-[10px] text-slate-300 font-sans pl-2">
              {deployment.riskFactors.slice(0, 2).map((factor, idx) => (
                <li key={idx} className="line-clamp-1 flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-slate-500 shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
              {deployment.riskFactors.length > 2 && (
                <li className="text-slate-500 font-mono text-[9px]">
                  +{deployment.riskFactors.length - 2} more signals...
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3 text-slate-600" />
            {deployment.author.name}
          </span>
          {deployment.changedFiles && (
            <span className="flex items-center gap-1 text-slate-400">
              <FileCode className="h-3 w-3 text-slate-600" />
              {deployment.changedFiles.length} files
            </span>
          )}
        </div>

        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-slate-600" />
          {deployment.deployedAt}
        </span>
      </div>
    </Card>
  );
};
