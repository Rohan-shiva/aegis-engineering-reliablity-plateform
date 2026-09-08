import React from "react";
import { IncidentTimelineEvent } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { AlertCircle, Bot, CheckCircle2, Clock, ShieldAlert, User, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface IncidentTimelineStreamProps {
  timeline: IncidentTimelineEvent[];
}

export const IncidentTimelineStream: React.FC<IncidentTimelineStreamProps> = ({ timeline }) => {
  return (
    <Card variant="default">
      <CardHeader className="border-b border-slate-800/80 pb-3">
        <CardTitle className="text-sm font-mono flex items-center gap-2">
          <Clock className="h-4 w-4 text-brand-light" />
          Incident Timeline Audit Trail ({timeline.length} Events)
        </CardTitle>
        <CardDescription>Real-time telemetry alerts, AI agent findings, and commander actions</CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="relative border-l-2 border-slate-800 ml-3 pl-6 space-y-6">
          {timeline.map((evt) => {
            const isDetection = evt.type === "detection";
            const isAI = evt.type === "investigation";
            const isMitigation = evt.type === "mitigation";
            const isResolution = evt.type === "resolution";

            return (
              <div key={evt.id} className="relative group">
                {/* Icon marker */}
                <div
                  className={cn(
                    "absolute -left-[35px] top-0 flex h-6 w-6 items-center justify-center rounded-full border text-xs shadow-sm",
                    isDetection && "border-red-600 bg-red-950 text-red-400",
                    isAI && "border-brand bg-brand/20 text-brand-light",
                    isMitigation && "border-amber-600 bg-amber-950 text-amber-400",
                    isResolution && "border-emerald-600 bg-emerald-950 text-emerald-400",
                    !isDetection && !isAI && !isMitigation && !isResolution && "border-slate-700 bg-slate-800 text-slate-300"
                  )}
                >
                  {isDetection && <ShieldAlert className="h-3.5 w-3.5" />}
                  {isAI && <Bot className="h-3.5 w-3.5" />}
                  {isMitigation && <AlertCircle className="h-3.5 w-3.5" />}
                  {isResolution && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {!isDetection && !isAI && !isMitigation && !isResolution && <User className="h-3.5 w-3.5" />}
                </div>

                {/* Body */}
                <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-4 transition-colors group-hover:border-slate-700">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between font-mono">
                    <span className="font-bold text-xs text-slate-100">{evt.title}</span>
                    <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
                  </div>

                  <p className="mt-1 text-xs text-slate-300 font-sans leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="mt-2 flex items-center gap-2 pt-2 border-t border-slate-800/60 font-mono text-[10px] text-slate-500">
                    <span>by <strong className="text-slate-300">{evt.author}</strong></span>
                    <span>•</span>
                    <span className="capitalize text-slate-400">[{evt.type}]</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
