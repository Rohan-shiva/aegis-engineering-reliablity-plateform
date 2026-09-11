import React from "react";
import Link from "next/link";
import { AIInvestigation } from "@/types/domain";
import { ArrowRight, Bot, CheckCircle2, Activity, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvestigationTableProps {
  investigations: AIInvestigation[];
}

export const InvestigationTable: React.FC<InvestigationTableProps> = ({ investigations }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-800 bg-surface">
      <table className="w-full text-left font-mono text-xs">
        <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3">Investigation Title</th>
            <th className="px-4 py-3">Target Node</th>
            <th className="px-4 py-3">Agent Status</th>
            <th className="px-4 py-3">Confidence</th>
            <th className="px-4 py-3">Tool Traces</th>
            <th className="px-4 py-3">Updated</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {investigations.map((inv) => (
            <tr key={inv.id} className="group hover:bg-slate-900/60 transition-colors">
              <td className="px-4 py-3.5 font-bold text-slate-200">
                <Link
                  href={`/investigations/${inv.id}`}
                  className="group-hover:text-brand-light transition-colors flex items-center gap-2"
                >
                  <Bot className="h-4 w-4 text-brand shrink-0" />
                  <span>{inv.title}</span>
                </Link>
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                  {inv.targetIncidentCode || inv.targetServiceName || "System"}
                </span>
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded px-2.5 py-0.5 font-bold text-[10px] uppercase",
                    inv.status === "completed" && "bg-emerald-950 text-emerald-400 border border-emerald-800/40",
                    inv.status === "analyzing" && "bg-brand/20 text-brand-light border border-brand/40 animate-pulse"
                  )}
                >
                  {inv.status}
                </span>
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap font-bold text-brand-light">
                {inv.confidenceScore}%
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap text-slate-300">
                {inv.toolCalls.length} Tool Executions
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                {inv.updatedAt}
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap text-right">
                <Link
                  href={`/investigations/${inv.id}`}
                  className="inline-flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-brand hover:text-white transition-colors"
                >
                  Inspect <ArrowRight className="h-3 w-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
