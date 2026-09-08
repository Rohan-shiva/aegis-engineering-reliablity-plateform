import React from "react";
import Link from "next/link";
import { Incident } from "@/types/domain";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { Card } from "@/components/ui/Card";
import { Bot, Clock, ArrowRight, User, MessageSquare, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface IncidentCardProps {
  incident: Incident;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident }) => {
  const isSev1 = incident.severity === "SEV-1";
  const isSev2 = incident.severity === "SEV-2";

  return (
    <Card
      variant="hover"
      className={cn(
        "flex flex-col justify-between p-4 relative transition-all duration-200 group border",
        isSev1 && "border-red-900/60 bg-red-950/20 hover:border-red-600/70",
        isSev2 && "border-orange-900/50 bg-orange-950/15 hover:border-orange-600/60",
        !isSev1 && !isSev2 && "border-slate-800/80 bg-slate-900/40"
      )}
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SeverityBadge severity={incident.severity} />
            <span className="font-mono text-xs font-bold text-slate-400">{incident.code}</span>
          </div>

          <span
            className={cn(
              "rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider",
              incident.status === "active" && "bg-red-950 text-red-400 border border-red-800/40 animate-pulse",
              incident.status === "investigating" && "bg-amber-950 text-amber-300 border border-amber-800/40",
              incident.status === "mitigated" && "bg-blue-950 text-blue-300 border border-blue-800/40",
              incident.status === "resolved" && "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
            )}
          >
            {incident.status}
          </span>
        </div>

        {/* Title & Summary */}
        <div className="mt-3 space-y-1">
          <Link
            href={`/incidents/${incident.id}`}
            className="font-mono text-sm font-bold text-slate-100 group-hover:text-red-300 transition-colors line-clamp-1 flex items-center justify-between"
          >
            <span>{incident.title}</span>
            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-red-400" />
          </Link>
          <p className="text-xs text-slate-400 line-clamp-2">{incident.summary}</p>
        </div>

        {/* Affected Services & Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
          {incident.affectedServices.map((srv) => (
            <span key={srv} className="rounded bg-slate-800/90 border border-slate-700/60 px-2 py-0.5 text-slate-300">
              {srv}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-2">
        {incident.rootCauseHypothesis && (
          <div className="flex items-center justify-between font-mono text-[10px] text-brand-light">
            <span className="flex items-center gap-1">
              <Bot className="h-3 w-3 text-brand" />
              AI Hypothesis ({incident.confidenceScore}% conf)
            </span>
          </div>
        )}

        <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 pt-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3 text-slate-600" />
              {incident.assignedTo.name}
            </span>
            {incident.communicationChannel && (
              <span className="flex items-center gap-1 text-slate-400">
                <MessageSquare className="h-3 w-3 text-slate-500" />
                {incident.communicationChannel}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-600" />
            {incident.createdAt}
          </span>
        </div>
      </div>
    </Card>
  );
};
