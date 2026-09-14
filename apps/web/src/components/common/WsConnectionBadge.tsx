import React from "react";
import { WsConnectionStatus } from "@/lib/websocket-client";
import { Radio, ZapOff } from "lucide-react";

export function WsConnectionBadge({ status }: { status: WsConnectionStatus }) {
  if (status === "connected") {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" title="Connected to WebSocket event stream">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        <Radio className="w-3.5 h-3.5" />
        <span>WS Streaming</span>
      </div>
    );
  }

  if (status === "connecting") {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>
        <span>Connecting WS...</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-slate-800/60 text-slate-400 border border-slate-700/60" title="WebSocket server offline. Using client fallback ticker.">
      <ZapOff className="w-3.5 h-3.5 text-amber-400" />
      <span>WS Simulated</span>
    </div>
  );
}
