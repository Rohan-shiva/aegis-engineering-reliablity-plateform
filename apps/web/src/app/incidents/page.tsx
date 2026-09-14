"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { IncidentCatalogHeader } from "@/components/incidents/IncidentCatalogHeader";
import { IncidentCard } from "@/components/incidents/IncidentCard";
import { IncidentTable } from "@/components/incidents/IncidentTable";
import { LiveEventBanner } from "@/components/common/LiveEventBanner";
import { WsConnectionBadge } from "@/components/common/WsConnectionBadge";
import { useIncidents } from "@/hooks/useIncidents";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import { SkeletonGrid } from "@/components/common/SkeletonCard";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { SeverityType } from "@/components/ui/SeverityBadge";
import { AlertTriangle } from "lucide-react";

export default function IncidentsCatalogPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { incidents, loading, isLive } = useIncidents({
    severity: selectedSeverity,
    status: selectedStatus,
    search: searchQuery,
  });

  const { wsStatus } = useRealtimeEvents();

  const activeIncidentsCount = incidents.filter(
    (i) => i.status === "active" || i.status === "investigating"
  ).length;

  return (
    <AppShell isLive={isLive}>
      {/* Live Active Incident Broadcast Banner */}
      <LiveEventBanner
        code="INC-8492"
        severity="SEV1"
        title="Payment Checkout 500 Error Spike & Connection Pool Exhaustion"
        description="Elevated 500 error rates on payment checkout processing endpoint post v2.4.1 deployment."
        incidentUrl="/incidents/inc-101"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Incident Event Stream
          </span>
          <WsConnectionBadge status={wsStatus} />
        </div>
      </div>

      {/* Header Toolbar */}
      <IncidentCatalogHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSeverity={selectedSeverity}
        onSeverityChange={setSelectedSeverity}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        totalIncidentsCount={incidents.length}
        activeIncidentsCount={activeIncidentsCount}
      />

      {/* Main Content */}
      {loading ? (
        viewMode === "grid" ? <SkeletonGrid count={6} /> : <TableSkeleton rows={6} />
      ) : incidents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-lg bg-slate-950/40">
          <AlertTriangle className="h-10 w-10 text-slate-600 mb-3" />
          <h3 className="font-mono text-sm font-semibold text-slate-300">No Incidents Found</h3>
          <p className="font-mono text-xs text-slate-500 mt-1 max-w-sm">
            No incident reports match your current filter parameters. Try clearing your search query or setting Severity to "All Sev".
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      ) : (
        <IncidentTable incidents={incidents} />
      )}
    </AppShell>
  );
}
