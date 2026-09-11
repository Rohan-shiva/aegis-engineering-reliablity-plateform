"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { InvestigationCatalogHeader } from "@/components/investigations/InvestigationCatalogHeader";
import { InvestigationCard } from "@/components/investigations/InvestigationCard";
import { InvestigationTable } from "@/components/investigations/InvestigationTable";
import { MOCK_INVESTIGATIONS } from "@/mocks";
import { Bot } from "lucide-react";

export default function InvestigationsCatalogPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedService, setSelectedService] = useState("all");

  const services = Array.from(
    new Set(MOCK_INVESTIGATIONS.map((i) => i.targetServiceName).filter(Boolean) as string[])
  );

  const filteredInvestigations = MOCK_INVESTIGATIONS.filter((inv) => {
    const matchesSearch =
      inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.plannerThought.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.hypotheses.some((h) => h.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.targetIncidentCode && inv.targetIncidentCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === "all" || inv.status === selectedStatus;
    const matchesService = selectedService === "all" || inv.targetServiceName === selectedService;

    return matchesSearch && matchesStatus && matchesService;
  });

  const analyzingCount = MOCK_INVESTIGATIONS.filter((i) => i.status === "analyzing").length;

  return (
    <AppShell>
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
        totalInvestigationsCount={MOCK_INVESTIGATIONS.length}
        analyzingCount={analyzingCount}
      />

      {/* Main Content */}
      {filteredInvestigations.length === 0 ? (
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
