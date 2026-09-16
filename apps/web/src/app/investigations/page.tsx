"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { InvestigationCatalogHeader } from "@/components/investigations/InvestigationCatalogHeader";
import { InvestigationCard } from "@/components/investigations/InvestigationCard";
import { InvestigationTable } from "@/components/investigations/InvestigationTable";
import { useInvestigations } from "@/hooks/useInvestigations";
import { SkeletonGrid } from "@/components/common/SkeletonCard";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { Bot } from "lucide-react";

export default function InvestigationsCatalogPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedService, setSelectedService] = useState("all");

  const { investigations, loading, isLive, triggerInvestigation } = useInvestigations({
    status: selectedStatus,
    search: searchQuery,
  });

  const services = Array.from(
    new Set(investigations.map((i) => i.targetServiceName).filter(Boolean) as string[])
  );

  const filteredInvestigations = investigations.filter((inv) => {
    return selectedService === "all" || inv.targetServiceName === selectedService;
  });

  const analyzingCount = investigations.filter((i) => i.status === "analyzing").length;

  return (
    <AppShell isLive={isLive}>
      {/* Header Toolbar */}
      <InvestigationCatalogHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedService={selectedService}
        onServiceChange={setSelectedService}
        services={services}
        totalInvestigationsCount={investigations.length}
        analyzingCount={analyzingCount}
        onTriggerInvestigation={async (params) => {
          await triggerInvestigation(params);
        }}
      />

      {/* Main Content */}
      {loading ? (
        viewMode === "grid" ? <SkeletonGrid count={6} /> : <TableSkeleton rows={6} />
      ) : filteredInvestigations.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-lg bg-slate-950/40">
          <Bot className="h-10 w-10 text-slate-600 mb-3" />
          <h3 className="font-mono text-sm font-semibold text-slate-300">No AI Investigations Found</h3>
          <p className="font-mono text-xs text-slate-500 mt-1 max-w-sm">
            No active or past agent investigation runs match your current filter criteria.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInvestigations.map((inv) => (
            <InvestigationCard key={inv.id} investigation={inv} />
          ))}
        </div>
      ) : (
        <InvestigationTable investigations={filteredInvestigations} />
      )}
    </AppShell>
  );
}
