"use client";

import React from "react";
import { SeverityType } from "@/components/ui/SeverityBadge";
import { Button } from "@/components/ui/Button";
import { Search, AlertTriangle, LayoutGrid, List, Plus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface IncidentCatalogHeaderProps {
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSeverity: SeverityType | "all";
  onSeverityChange: (sev: SeverityType | "all") => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  totalIncidentsCount: number;
  activeIncidentsCount: number;
}

export const IncidentCatalogHeader: React.FC<IncidentCatalogHeaderProps> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  selectedSeverity,
  onSeverityChange,
  selectedStatus,
  onStatusChange,
  totalIncidentsCount,
  activeIncidentsCount,
}) => {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-5">
      {/* Top Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Incident Command & Triage
            </h1>
            {activeIncidentsCount > 0 && (
              <span className="rounded bg-red-950 border border-red-800/60 px-2 py-0.5 font-mono text-[11px] font-bold text-red-400 animate-pulse">
                {activeIncidentsCount} Active
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Real-time incident response rooms, AI root-cause evidence correlation, and timeline audit logs.
          </p>
        </div>

        <Button variant="danger" size="sm" className="gap-1.5 font-mono self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Declare Incident</span>
        </Button>
      </div>

      {/* Filter & Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search code, title, service, tag..."
              className="w-56 sm:w-64 rounded-md border border-slate-800 bg-slate-950/60 py-1.5 pl-9 pr-3 font-mono text-xs text-slate-200 placeholder-slate-500 focus:border-brand/60 focus:outline-none"
            />
          </div>

          {/* Severity Filter Pills */}
          <div className="flex items-center rounded-md border border-slate-800 bg-slate-950/60 p-1 font-mono text-xs text-slate-400">
            <button
              onClick={() => onSeverityChange("all")}
              className={cn(
                "rounded px-2 py-1 transition-colors",
                selectedSeverity === "all" ? "bg-slate-800 text-slate-100 font-semibold" : "hover:text-slate-200"
              )}
            >
              All Sev
            </button>
            <button
              onClick={() => onSeverityChange("SEV-1")}
              className={cn(
                "rounded px-2 py-1 transition-colors",
                selectedSeverity === "SEV-1" ? "bg-red-950 text-red-400 font-bold border border-red-800/40" : "hover:text-red-400"
              )}
            >
              SEV-1
            </button>
            <button
              onClick={() => onSeverityChange("SEV-2")}
              className={cn(
                "rounded px-2 py-1 transition-colors",
                selectedSeverity === "SEV-2" ? "bg-orange-950 text-orange-400 font-semibold border border-orange-800/40" : "hover:text-orange-400"
              )}
            >
              SEV-2
            </button>
            <button
              onClick={() => onSeverityChange("SEV-3")}
              className={cn(
                "rounded px-2 py-1 transition-colors",
                selectedSeverity === "SEV-3" ? "bg-amber-950 text-amber-300 font-semibold border border-amber-800/40" : "hover:text-amber-300"
              )}
            >
              SEV-3
            </button>
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-md border border-slate-800 bg-slate-950/60 py-1.5 px-3 font-mono text-xs text-slate-300 focus:border-brand/60 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="mitigated">Mitigated</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-md border border-slate-800 bg-slate-950/60 p-1">
          <button
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "rounded p-1.5 text-slate-400 transition-colors",
              viewMode === "grid" ? "bg-slate-800 text-brand-light" : "hover:text-slate-200"
            )}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            className={cn(
              "rounded p-1.5 text-slate-400 transition-colors",
              viewMode === "table" ? "bg-slate-800 text-brand-light" : "hover:text-slate-200"
            )}
            title="Table View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
