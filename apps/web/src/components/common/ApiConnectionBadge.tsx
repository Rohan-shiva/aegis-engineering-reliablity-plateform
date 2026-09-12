import React from "react";
import { Server, WifiOff } from "lucide-react";

export interface ApiConnectionBadgeProps {
  isLive?: boolean;
}

export function ApiConnectionBadge({ isLive = true }: ApiConnectionBadgeProps) {
  if (isLive) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <Server className="w-3.5 h-3.5" />
        <span>Live API</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20" title="API server offline. Serving local mock fallback data.">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
      <WifiOff className="w-3.5 h-3.5" />
      <span>Mock Mode</span>
    </div>
  );
}
