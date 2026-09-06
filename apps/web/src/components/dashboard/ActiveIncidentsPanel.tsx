"use client";

import React, { useState } from "react";
import { Incident } from "@/types/domain";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  AlertTriangle,
  Bot,
  Activity,
  User,
  Clock,
  ArrowRight,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveIncidentsPanelProps {
  incidents: Incident[];
  onOpenRoom?: (incident: Incident) => void;
}

export const ActiveIncidentsPanel: React.FC<ActiveIncidentsPanelProps> = ({
  incidents,
  onOpenRoom,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  return (
    <>
      {/* Panel Container */}
      <Card variant="default" className="border-red-900/30 bg-red-950/10">
        <CardHeader className="border-b border-red-900/20 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-mono flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-4 w-4" />
              Active Incidents ({incidents.length})
            </CardTitle>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          </div>
          <CardDescription>Click any incident to launch AI diagnostic investigation drawer</CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-4 space-y-3">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => setSelectedIncident(inc)}
              className={cn(
                "group relative flex flex-col space-y-2 p-3.5 rounded-lg border transition-all duration-150 cursor-pointer",
                inc.severity === "SEV-1"
                  ? "border-red-900/50 bg-red-950/30 hover:border-red-600/60 hover:bg-red-950/50"
                  : "border-amber-900/50 bg-amber-950/20 hover:border-amber-600/60 hover:bg-amber-950/40"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={inc.severity} />
                  <span className="font-mono text-[10px] text-slate-400">{inc.code}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-500" /> {inc.createdAt}
                </span>
              </div>

              <h4 className="font-semibold text-xs text-slate-100 group-hover:text-red-300 transition-colors">
                {inc.title}
              </h4>

              <p className="text-[11px] text-slate-400 line-clamp-2">{inc.summary}</p>

              {inc.rootCauseHypothesis && (
                <div className="mt-1 flex items-center justify-between pt-2 border-t border-red-900/30 text-[10px] font-mono">
                  <span className="text-brand-light flex items-center gap-1">
                    <Bot className="h-3 w-3 text-brand" />
                    AI Hypothesis ({inc.confidenceScore}% conf)
                  </span>
                  <span className="text-slate-400 group-hover:text-white flex items-center gap-0.5">
                    Investigate <ArrowRight className="h-2.5 w-2.5" />
                  </span>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Slide-over Incident Details Drawer */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedIncident(null)}
          />

          {/* Drawer Content */}
          <div className="relative z-50 flex h-full w-full max-w-lg flex-col bg-surface border-l border-slate-800 p-6 shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={selectedIncident.severity} />
                  <span className="font-mono text-xs font-bold text-slate-400">{selectedIncident.code}</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300 uppercase">
                    {selectedIncident.status}
                  </span>
                </div>
                <h3 className="font-mono text-base font-bold text-slate-100">{selectedIncident.title}</h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Impact & Summary */}
            <div className="my-5 space-y-4 font-mono text-xs">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Impact Assessment
                </span>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">
                  {selectedIncident.impactDescription}
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="text-slate-500">Affected Services:</span>
                  {selectedIncident.affectedServices.map((srv) => (
                    <span key={srv} className="rounded bg-red-950/60 border border-red-800/40 px-1.5 py-0.5 text-red-300">
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Agent Root Cause Analysis */}
              {selectedIncident.rootCauseHypothesis && (
                <div className="rounded-lg border border-brand/40 bg-brand/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-brand-light text-xs">
                      <Bot className="h-4 w-4 text-brand" />
                      Aegis AI Root Cause Hypothesis
                    </span>
                    <span className="rounded bg-brand/20 px-2 py-0.5 text-[10px] font-bold text-brand-light">
                      {selectedIncident.confidenceScore}% CONFIDENCE
                    </span>
                  </div>
                  <p className="text-slate-200 font-sans text-xs leading-relaxed">
                    {selectedIncident.rootCauseHypothesis}
                  </p>
                </div>
              )}

              {/* Assigned Commander */}
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 font-mono text-xs font-bold text-slate-200 border border-slate-700">
                    {selectedIncident.assignedTo.avatarInitials}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block">{selectedIncident.assignedTo.name}</span>
                    <span className="text-[10px] text-slate-500 block">{selectedIncident.assignedTo.role}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Commander</span>
              </div>

              {/* Timeline Stream */}
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Incident Timeline
                </span>
                <div className="space-y-3 border-l border-slate-800 pl-3">
                  {selectedIncident.timeline.map((evt) => (
                    <div key={evt.id} className="relative space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-200">{evt.title}</span>
                        <span className="text-slate-500 font-mono">{evt.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans">{evt.description}</p>
                      <span className="text-[10px] text-slate-500 block">by {evt.author}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-auto border-t border-slate-800 pt-4">
              <Button
                variant="danger"
                className="w-full justify-center gap-2 font-mono"
                onClick={() => onOpenRoom?.(selectedIncident)}
              >
                <span>Enter Live Incident Room</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
