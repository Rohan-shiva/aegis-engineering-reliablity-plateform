import React from "react";
import Link from "next/link";
import { Incident } from "@/types/domain";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { ArrowRight, Bot, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface IncidentTableProps {
  incidents: Incident[];
}

export const IncidentTable: React.FC<IncidentTableProps> = ({ incidents }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-800 bg-surface">
      <table className="w-full text-left font-mono text-xs">
        <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3">Code</th>
            <th className="px-4 py-3">Severity</th>
            <th className="px-4 py-3">Title & Summary</th>
            <th className="px-4 py-3">Affected Services</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Commander</th>
            <th className="px-4 py-3">Opened</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {incidents.map((inc) => (
            <tr key={inc.id} className="group hover:bg-slate-900/60 transition-colors">
              <td className="px-4 py-3.5 font-bold text-slate-300 whitespace-nowrap">
                {inc.code}
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap">
                <SeverityBadge severity={inc.severity} />
              </td>

              <td className="px-4 py-3.5">
                <Link
                  href={`/incidents/${inc.id}`}
                  className="font-bold text-slate-200 group-hover:text-red-300 transition-colors block"
                >
                  {inc.title}
                </Link>
                <span className="text-[11px] text-slate-400 font-sans line-clamp-1">
                  {inc.summary}
                </span>
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {inc.affectedServices.map((srv) => (
                    <span key={srv} className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                      {srv}
                    </span>
                  ))}
                </div>
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap">
                <span
                  className={cn(
                    "rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    inc.status === "active" && "bg-red-950 text-red-400 border border-red-800/40",
                    inc.status === "investigating" && "bg-amber-950 text-amber-300 border border-amber-800/40",
                    inc.status === "mitigated" && "bg-blue-950 text-blue-300 border border-blue-800/40",
                    inc.status === "resolved" && "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                  )}
                >
                  {inc.status}
                </span>
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap text-slate-300 text-[11px]">
                {inc.assignedTo.name}
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                {inc.createdAt}
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap text-right">
                <Link
                  href={`/incidents/${inc.id}`}
                  className="inline-flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-red-600 hover:text-white transition-colors"
                >
                  Room <ArrowRight className="h-3 w-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
