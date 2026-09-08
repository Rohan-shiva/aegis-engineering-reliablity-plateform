"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { IncidentTimelineStream } from "@/components/incidents/IncidentTimelineStream";
import { IncidentAISidebar } from "@/components/incidents/IncidentAISidebar";
import { IncidentMetaSidebar } from "@/components/incidents/IncidentMetaSidebar";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { Button } from "@/components/ui/Button";
import { MOCK_INCIDENTS } from "@/mocks";
import { Incident } from "@/types/domain";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RotateCcw,
  MessageSquare,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IncidentRoomPageProps {
  params: {
    incidentId: string;
  };
}

export default function IncidentRoomPage({ params }: IncidentRoomPageProps) {
  const initialIncident = MOCK_INCIDENTS.find(
    (i) => i.id === params.incidentId || i.code.toLowerCase() === params.incidentId.toLowerCase()
  );

  const [incident, setIncident] = useState<Incident | undefined>(initialIncident);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!incident) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center p-12 text-center border border-slate-800 rounded-lg">
          <AlertTriangle className="h-10 w-10 text-slate-600 mb-2" />
          <h2 className="font-mono text-base font-bold text-slate-200">Incident Room Not Found</h2>
          <p className="font-mono text-xs text-slate-400 mt-1 mb-4">
            No active or archived incident room matches ID "{params.incidentId}".
          </p>
          <Link href="/incidents">
            <Button variant="secondary" size="sm" className="gap-1 font-mono">
              <ArrowLeft className="h-4 w-4" /> Return to Incident Catalog
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusChange = (newStatus: Incident["status"]) => {
    setIncident((prev) => (prev ? { ...prev, status: newStatus } : undefined));
    triggerToast(`Incident status updated to '${newStatus.toUpperCase()}'.`);
  };

  return (
    <AppShell>
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-brand/40 bg-surface/95 px-4 py-3 shadow-2xl backdrop-blur-md font-mono text-xs text-slate-100">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Back Breadcrumb */}
      <div className="space-y-4 border-b border-slate-800/80 pb-5">
        <Link
          href="/incidents"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Incident Command</span>
        </Link>

        {/* Title Bar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <SeverityBadge severity={incident.severity} />
              <span className="font-mono text-xs font-bold text-slate-400">{incident.code}</span>
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
            <h1 className="font-mono text-xl font-bold text-slate-100">{incident.title}</h1>
            <p className="text-xs text-slate-400 font-sans max-w-3xl">{incident.summary}</p>
          </div>

          {/* Interactive State Actions Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {incident.status === "active" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleStatusChange("investigating")}
                className="gap-1.5 font-mono text-amber-300 border-amber-800/50 hover:bg-amber-950/60"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Acknowledge</span>
              </Button>
            )}

            {(incident.status === "active" || incident.status === "investigating") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("mitigated")}
                className="gap-1.5 font-mono text-blue-300 border-blue-800/50 hover:bg-blue-950/60"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Mark Mitigated</span>
              </Button>
            )}

            {incident.status !== "resolved" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStatusChange("resolved")}
                className="gap-1.5 font-mono bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Resolve Incident</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Incident Room 2-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 pt-2">
        {/* Left Column: Timeline Stream (2/3 width) */}
        <div className="space-y-6 lg:col-span-2">
          <IncidentTimelineStream timeline={incident.timeline} />
        </div>

        {/* Right Column: AI Evidence & Incident Metadata (1/3 width) */}
        <div className="space-y-6">
          <IncidentAISidebar incident={incident} />
          <IncidentMetaSidebar incident={incident} />
        </div>
      </div>
    </AppShell>
  );
}
