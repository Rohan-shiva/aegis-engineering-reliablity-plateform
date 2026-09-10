"use client";

import React from "react";
import { Search, BookOpen, LayoutGrid, List, Upload, Bot, Database } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface KnowledgeCatalogHeaderProps {
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  totalDocsCount: number;
  indexedCount: number;
}

export const KnowledgeCatalogHeader: React.FC<KnowledgeCatalogHeaderProps> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  totalDocsCount,
  indexedCount,
}) => {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-5">
      {/* Top Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-brand-light" />
              Engineering Knowledge Intelligence
            </h1>
            <span className="rounded bg-brand/10 border border-brand/20 px-2 py-0.5 font-mono text-[11px] text-brand-light font-bold flex items-center gap-1">
              <Database className="h-3 w-3" />
              {indexedCount} Indexed in Qdrant
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Semantic vector search across runbooks, postmortems, architecture specs, and incident response history.
          </p>
        </div>

        <Button variant="primary" size="sm" className="gap-1.5 font-mono self-start sm:self-auto">
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
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
              placeholder="Semantic search runbooks, postmortems, tags..."
              className="w-60 sm:w-72 rounded-md border border-slate-800 bg-slate-950/60 py-1.5 pl-9 pr-3 font-mono text-xs text-slate-200 placeholder-slate-500 focus:border-brand/60 focus:outline-none"
            />
          </div>

          {/* Type Filter Dropdown */}
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="rounded-md border border-slate-800 bg-slate-950/60 py-1.5 px-3 font-mono text-xs text-slate-300 focus:border-brand/60 focus:outline-none"
          >
            <option value="all">All Document Types</option>
            <option value="runbook">Runbooks</option>
            <option value="postmortem">Postmortems</option>
            <option value="architecture_doc">Architecture Specs</option>
          </select>

          {/* Ingestion Status Filter Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-md border border-slate-800 bg-slate-950/60 py-1.5 px-3 font-mono text-xs text-slate-300 focus:border-brand/60 focus:outline-none"
          >
            <option value="all">All Ingestion Statuses</option>
            <option value="indexed">Indexed (Qdrant RAG)</option>
            <option value="indexing">Indexing in Progress</option>
            <option value="failed">Failed Ingestion</option>
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
