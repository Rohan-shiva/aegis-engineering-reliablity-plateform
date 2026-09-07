"use client";

import React from "react";
import { Search, LayoutGrid, List, Filter, Server, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ServiceCatalogHeaderProps {
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedEnv: string;
  onEnvChange: (env: string) => void;
  selectedTeam: string;
  onTeamChange: (team: string) => void;
  teams: string[];
  totalServicesCount: number;
}

export const ServiceCatalogHeader: React.FC<ServiceCatalogHeaderProps> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  selectedEnv,
  onEnvChange,
  selectedTeam,
  onTeamChange,
  teams,
  totalServicesCount,
}) => {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-5">
      {/* Top Title Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <Server className="h-5 w-5 text-brand" />
              Service Catalog
            </h1>
            <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono text-[11px] text-slate-300">
              {totalServicesCount} Registered
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Real-time status, latency metrics, dependency trees, and deployment activity across all service nodes.
          </p>
        </div>

        <Button variant="primary" size="sm" className="gap-1.5 font-mono self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Register Service</span>
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
              placeholder="Search service name, team, framework..."
              className="w-56 sm:w-64 rounded-md border border-slate-800 bg-slate-950/60 py-1.5 pl-9 pr-3 font-mono text-xs text-slate-200 placeholder-slate-500 focus:border-brand/60 focus:outline-none"
            />
          </div>

          {/* Environment Filter Pill Group */}
          <div className="flex items-center rounded-md border border-slate-800 bg-slate-950/60 p-1 font-mono text-xs text-slate-400">
            <button
              onClick={() => onEnvChange("all")}
              className={cn(
                "rounded px-2.5 py-1 transition-colors",
                selectedEnv === "all" ? "bg-slate-800 text-slate-100 font-semibold" : "hover:text-slate-200"
              )}
            >
              All Envs
            </button>
            <button
              onClick={() => onEnvChange("production")}
              className={cn(
                "rounded px-2.5 py-1 transition-colors",
                selectedEnv === "production" ? "bg-slate-800 text-slate-100 font-semibold" : "hover:text-slate-200"
              )}
            >
              Production
            </button>
            <button
              onClick={() => onEnvChange("staging")}
              className={cn(
                "rounded px-2.5 py-1 transition-colors",
                selectedEnv === "staging" ? "bg-slate-800 text-slate-100 font-semibold" : "hover:text-slate-200"
              )}
            >
              Staging
            </button>
          </div>

          {/* Team Filter Dropdown */}
          <select
            value={selectedTeam}
            onChange={(e) => onTeamChange(e.target.value)}
            className="rounded-md border border-slate-800 bg-slate-950/60 py-1.5 px-3 font-mono text-xs text-slate-300 focus:border-brand/60 focus:outline-none"
          >
            <option value="all">All Teams</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle (Grid vs Table) */}
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
