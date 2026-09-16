"use client";

import React, { useState } from "react";
import { Search, Bot, LayoutGrid, List, Sparkles, Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { TriggerInvestigationModal } from "./TriggerInvestigationModal";

interface InvestigationCatalogHeaderProps {
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedService: string;
  onServiceChange: (service: string) => void;
  services: string[];
  totalInvestigationsCount: number;
  analyzingCount: number;
  onTriggerInvestigation?: (params: { targetIncidentCode: string; targetServiceName: string }) => Promise<void>;
}

export const InvestigationCatalogHeader: React.FC<InvestigationCatalogHeaderProps> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedService,
  onServiceChange,
  services,
  totalInvestigationsCount,
  analyzingCount,
  onTriggerInvestigation,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTrigger = async (params: { targetIncidentCode: string; targetServiceName: string }) => {
    if (onTriggerInvestigation) {
      await onTriggerInvestigation(params);
    }
  };

  return (
    <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-5">
      {/* Top Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <Bot className="h-5 w-5 text-brand" />
              Autonomous AI Investigator
            </h1>
            {analyzingCount > 0 ? (
              <span className="rounded bg-brand/20 border border-brand/40 px-2 py-0.5 font-mono text-[11px] font-bold text-brand-light flex items-center gap-1.5 animate-pulse">
                <Activity className="h-3 w-3 animate-spin text-brand" />
                {analyzingCount} Active Agent
              </span>
            ) : (
              <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono text-[11px] text-slate-300">
                {totalInvestigationsCount} Runs
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Tool-calling agent architecture (Planner → Telemetry / Log Query → Hypothesis → Evidence → Action).
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 font-mono self-start sm:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          <span>New Investigation</span>
        </Button>
      </div>

      {/* Trigger Investigation Modal */}
      <TriggerInvestigationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTrigger={handleTrigger}
      />

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
              placeholder="Search code, title, hypothesis..."
              className="w-56 sm:w-64 rounded-md border border-slate-800 bg-slate-950/60 py-1.5 pl-9 pr-3 font-mono text-xs text-slate-200 placeholder-slate-500 focus:border-brand/60 focus:outline-none"
            />
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-md border border-slate-800 bg-slate-950/60 py-1.5 px-3 font-mono text-xs text-slate-300 focus:border-brand/60 focus:outline-none"
          >
            <option value="all">All Agent Statuses</option>
            <option value="completed">Completed</option>
            <option value="analyzing">Analyzing (Active)</option>
            <option value="requires_input">Requires Engineer Input</option>
          </select>

          {/* Service Filter Dropdown */}
          <select
            value={selectedService}
            onChange={(e) => onServiceChange(e.target.value)}
            className="rounded-md border border-slate-800 bg-slate-950/60 py-1.5 px-3 font-mono text-xs text-slate-300 focus:border-brand/60 focus:outline-none"
          >
            <option value="all">All Microservices</option>
            {services.map((srv) => (
              <option key={srv} value={srv}>
                {srv}
              </option>
            ))}
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
