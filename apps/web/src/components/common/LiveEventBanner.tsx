import React from "react";
import { AlertCircle, Activity, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface LiveEventBannerProps {
  title: string;
  description: string;
  code?: string;
  severity?: "SEV1" | "SEV2" | "SEV-1" | "SEV-2";
  incidentUrl?: string;
}

export function LiveEventBanner({
  title,
  description,
  code = "INC-8492",
  severity = "SEV1",
  incidentUrl = "/incidents/inc-101",
}: LiveEventBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-red-500/30 bg-gradient-to-r from-red-950/80 via-slate-900/90 to-slate-950 p-4 shadow-lg shadow-red-950/20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 mt-0.5 md:mt-0">
            <AlertCircle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                LIVE {severity}
              </span>
              <span className="font-mono text-xs font-semibold text-slate-200">{code}</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-xs text-slate-400">Active Incident Alert</span>
            </div>
            <h4 className="text-sm font-semibold text-slate-100 mt-1">{title}</h4>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-2 md:pt-0 border-t border-slate-800 md:border-t-0">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Streaming</span>
          </div>
          <Link
            href={incidentUrl}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-500 text-white transition-colors shadow-sm"
          >
            <span>Open Incident War Room</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
