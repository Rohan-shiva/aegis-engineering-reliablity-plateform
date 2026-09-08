import React from "react";
import { Incident } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Bot, CheckCircle2, AlertTriangle, FileCode, Search, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface IncidentAISidebarProps {
  incident: Incident;
}

export const IncidentAISidebar: React.FC<IncidentAISidebarProps> = ({ incident }) => {
  return (
    <Card variant="bordered" className="border-brand/30 bg-slate-900/40 space-y-4">
      <CardHeader className="pb-2 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono flex items-center gap-2 text-brand-light">
            <Bot className="h-4 w-4 text-brand" />
            Aegis AI Investigator
          </CardTitle>
          {incident.confidenceScore && (
            <span className="rounded bg-brand/20 px-2 py-0.5 font-mono text-[10px] font-bold text-brand-light border border-brand/40">
              {incident.confidenceScore}% CONFIDENCE
            </span>
          )}
        </div>
        <CardDescription>Autonomous root-cause hypothesis and evidence correlation</CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4 font-mono text-xs">
        {/* Root Cause Hypothesis Box */}
        {incident.rootCauseHypothesis ? (
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 space-y-2">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Root Cause Hypothesis
            </span>
            <p className="text-slate-200 font-sans text-xs leading-relaxed">
              "{incident.rootCauseHypothesis}"
            </p>
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-slate-500 font-mono">
            AI Investigator is currently querying telemetry logs...
          </div>
        )}

        {/* Evidence Checklist */}
        {incident.evidences && incident.evidences.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Correlated Evidence Signals ({incident.evidences.length})
            </span>

            <div className="space-y-2">
              {incident.evidences.map((ev) => (
                <div key={ev.id} className="rounded-md border border-slate-800/80 bg-slate-950/60 p-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <FileCode className="h-3.5 w-3.5 text-brand-light" />
                      {ev.title}
                    </span>
                    <span className="text-[9px] text-slate-500 uppercase">[{ev.type}]</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono line-clamp-2 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    {ev.snippet}
                  </p>
                  <span className="text-[9px] text-slate-500 block text-right">Source: {ev.source}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-3 space-y-1.5 font-sans">
          <span className="text-[10px] font-semibold font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Recommended Mitigation
          </span>
          <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
            <li>Execute canary rollback to commit <code>f3e2b10</code>.</li>
            <li>Re-index PostgreSQL payment ledger table offline.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
