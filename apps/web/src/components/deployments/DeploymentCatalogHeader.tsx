"use client";

import React from "react";
import { Search, GitCommit, LayoutGrid, List, AlertTriangle, ShieldCheck, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface DeploymentCatalogHeaderProps {
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRiskLevel: "all" | "HIGH" | "MEDIUM" | "LOW";
  onRiskLevelChange: (level: "all" | "HIGH" | "MEDIUM" | "LOW") => void;
  selectedEnv: string;
  onEnvChange: (env: string) => void;
  totalDeploymentsCount: number;
  highRiskCount: number;
}

export const DeploymentCatalogHeader: React.FC<DeploymentCatalogHeaderProps> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  selectedRiskLevel,
  onRiskLevelChange,
  selectedEnv,
  onEnvChange,
  totalDeploymentsCount,
  highRiskCount,
}) => {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-5">
      {/* Top Title Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <GitCommit className="h-5 w-5 text-emerald-400" />
              Deployment Stream & Risk Intelligence
            </h1>
            {highRiskCount > 0 && (
              <span className="rounded bg-red-950 border border-red-800/60 px-2 py-0.5 font-mono text-[11px] font-bold text-red-400">
                {highRiskCount} High Risk
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Automated change risk analysis, deterministic signal scoring, and blast radius auditing across deployments.
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-1.5 font-mono self-start sm:self-auto">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Configure Risk Rules</span>
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
              placeholder="Search service, SHA, author, commit..."
              className="w-56 sm:w-64 rounded-md border border-slate-800 bg-slate-950/60 py-1.5 pl-9 pr-3 font-mono text-xs text-slate-200 placeholder-slate-500 focus:border-brand/60 focus:outline-none"
            />
          </div>

          {/* Risk Level Filter Pills */}
          <div className="flex items-center rounded-md border border-slate-800 bg-slate-950/60 p-1 font-mono text-xs text-slate-400">
            <button
              onClick={() => onRiskLevelChange("all")}
              className={cn(
                "rounded px-2 py-1 transition-colors",
                selectedRiskLevel === "all" ? "bg-slate-800 text-slate-100 font-semibold" : "hover:text-slate-200"
              )}
            >
              All Risk
            </button>
            <button
              onClick={() => onRiskLevelChange("HIGH")}
              className={cn(
                "rounded px-2 py-1 transition-colors",
                selectedRiskLevel === "HIGH" ? "bg-red-950 text-red-400 font-bold border border-red-800/40" : "hover:text-red-400"
              )}
            >
              HIGH (71-100)
            </button>
            <button
              onClick={() => onRiskLevelChange("MEDIUM")}
              className={cn(
                "rounded px-2 py-1 transition-colors",
                selectedRiskLevel === "MEDIUM" ? "bg-amber-950 text-amber-300 font-semibold border border-amber-800/40" : "hover:text-amber-300"
              )}
            >
              MEDIUM (31-70)
            </button>
            <button
              onClick={() => onRiskLevelChange("LOW")}
              className={cn(
                "rounded px-2 py-1 transition-colors",
                selectedRiskLevel === "LOW" ? "bg-emerald-950 text-emerald-400 font-semibold border border-emerald-800/40" : "hover:text-emerald-400"
              )}
            >
              LOW (0-30)
            </button>
          </div>

          {/* Environment Filter Pill Group */}
          <div className="flex items-center rounded-md border border-slate-800 bg-slate-950/60 p-1 font-mono text-xs text-slate-400">
            <button
              onClick={() => onEnvChange("all")}
              className={cn(
                "rounded px-2 py-1 transition-colors",
                selectedEnv === "all" ? "bg-slate-800 text-slate-100 font-semibold" : "hover:text-slate-200"
              )}
            >
              All Envs
            </button>
            <button
              onClick={() => onEnvChange("PROD")}
              className={cn(
                "rounded px-2 py-1 transition-colors",
                selectedEnv === "PROD" ? "bg-slate-800 text-slate-100 font-semibold" : "hover:text-slate-200"
              )}
            >
              PROD
            </button>
            <button
              onClick={() => onEnvChange("STAGING")}
              className={cn(
                "rounded px-2 py-1 transition-colors",
                selectedEnv === "STAGING" ? "bg-slate-800 text-slate-100 font-semibold" : "hover:text-slate-200"
              )}
            >
              STAGING
            </button>
          </div>
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
