import React from "react";
import Link from "next/link";
import { AIInvestigation } from "@/types/domain";
import { Card } from "@/components/ui/Card";
import { Bot, Activity, Clock, ArrowRight, Wrench, ShieldCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvestigationCardProps {
  investigation: AIInvestigation;
}

export const InvestigationCard: React.FC<InvestigationCardProps> = ({ investigation: inv }) => {
  const primaryHypothesis = inv.hypotheses.find((h) => h.isPrimary) || inv.hypotheses[0];

  return (
    <Card
      variant="hover"
      className="flex flex-col justify-between p-4 relative transition-all duration-200 group border border-slate-800/80 bg-slate-900/40 font-mono text-xs"
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {inv.targetIncidentCode && (
              <span className="rounded bg-red-950/80 border border-red-800/60 text-red-400 px-2 py-0.5 font-bold text-[10px]">
                {inv.targetIncidentCode}
              </span>
            )}
            {inv.targetServiceName && (
              <span className="rounded bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 text-[10px]">
                {inv.targetServiceName}
              </span>
            )}
          </div>

          <span
            className={cn(
              "inline-flex items-center gap-1 rounded px-2.5 py-0.5 font-bold text-[10px]",
              inv.status === "completed" && "bg-emerald-950 text-emerald-400 border border-emerald-800/40",
              inv.status === "analyzing" && "bg-brand/20 text-brand-light border border-brand/40 animate-pulse"
            )}
          >
            {inv.status === "analyzing" ? <Activity className="h-3 w-3 animate-spin text-brand" /> : <CheckCircle2 className="h-3 w-3" />}
            <span className="uppercase">{inv.status}</span>
          </span>
        </div>

        {/* Title */}
        <div className="mt-3 space-y-1">
          <Link
            href={`/investigations/${inv.id}`}
            className="font-mono text-sm font-bold text-slate-100 group-hover:text-brand-light transition-colors line-clamp-1 flex items-center justify-between"
          >
            <span>{inv.title}</span>
            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-light ml-2" />
          </Link>

          {/* Primary Hypothesis Preview */}
          {primaryHypothesis && (
            <div className="mt-2 rounded bg-slate-950 p-2.5 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500 uppercase font-semibold">Primary Hypothesis</span>
                <span className="font-bold text-brand-light">{primaryHypothesis.confidencePercentage}% CONFIDENCE</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans line-clamp-2 leading-tight">
                {primaryHypothesis.title}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-slate-300">
            <Wrench className="h-3 w-3 text-brand" />
            {inv.toolCalls.length} Tool Executions
          </span>
        </div>

        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-slate-600" />
          {inv.updatedAt}
        </span>
      </div>
    </Card>
  );
};
