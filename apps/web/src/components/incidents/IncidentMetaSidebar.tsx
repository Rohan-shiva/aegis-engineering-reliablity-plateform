import React from "react";
import Link from "next/link";
import { Incident } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { User, Server, ExternalLink, MessageSquare, Activity, FileText } from "lucide-react";

interface IncidentMetaSidebarProps {
  incident: Incident;
}

export const IncidentMetaSidebar: React.FC<IncidentMetaSidebarProps> = ({ incident }) => {
  return (
    <div className="space-y-4">
      {/* 1. Commander & Response Team Card */}
      <Card variant="default">
        <CardHeader className="border-b border-slate-800/80 pb-3">
          <CardTitle className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Incident Response Lead
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-bold">
              {incident.assignedTo.avatarInitials}
            </div>
            <div>
              <span className="font-bold text-slate-200 block">{incident.assignedTo.name}</span>
              <span className="text-[10px] text-slate-500">{incident.assignedTo.role}</span>
            </div>
          </div>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">Commander</span>
        </CardContent>
      </Card>

      {/* 2. Affected Services Card */}
      <Card variant="default">
        <CardHeader className="border-b border-slate-800/80 pb-3">
          <CardTitle className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Affected Services ({incident.affectedServices.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2 font-mono text-xs">
          {incident.affectedServices.map((serviceName) => (
            <div
              key={serviceName}
              className="flex items-center justify-between p-2.5 rounded-md border border-slate-800 bg-slate-900/40"
            >
              <div className="flex items-center gap-2">
                <Server className="h-3.5 w-3.5 text-red-400" />
                <span className="font-bold text-slate-200">{serviceName}</span>
              </div>
              <Link
                href={`/services/${serviceName}`}
                className="text-[10px] text-brand-light hover:underline flex items-center gap-0.5"
              >
                Inspect <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. Telemetry Snapshots Card */}
      {incident.telemetrySnapshots && incident.telemetrySnapshots.length > 0 && (
        <Card variant="default">
          <CardHeader className="border-b border-slate-800/80 pb-3">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Telemetry Alert Snapshots
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 font-mono text-xs">
            {incident.telemetrySnapshots.map((snap, idx) => (
              <div key={idx} className="p-2.5 rounded-md border border-slate-800 bg-slate-950/60 space-y-1">
                <span className="text-[10px] text-slate-500 block">{snap.metricName}</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-red-400 text-sm">{snap.valueAtDetection}</span>
                  <span className="text-[10px] text-slate-400">Threshold: {snap.threshold}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 4. Quick Links */}
      <Card variant="default">
        <CardHeader className="border-b border-slate-800/80 pb-3">
          <CardTitle className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Operations & Runbooks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2 font-mono text-xs">
          {incident.communicationChannel && (
            <a
              href={`https://slack.com/app`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2 rounded border border-slate-800 bg-slate-900/40 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-brand-light" />
                Slack Channel
              </span>
              <span className="text-[10px] text-slate-400">{incident.communicationChannel}</span>
            </a>
          )}

          {incident.runbookUrl && (
            <a
              href={incident.runbookUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2 rounded border border-slate-800 bg-slate-900/40 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-emerald-400" />
                Emergency Runbook
              </span>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
