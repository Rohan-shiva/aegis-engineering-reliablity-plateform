"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceCatalogHeader } from "@/components/services/ServiceCatalogHeader";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceTable } from "@/components/services/ServiceTable";
import { MOCK_SERVICES } from "@/mocks";
import { Server } from "lucide-react";

export default function ServicesCatalogPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnv, setSelectedEnv] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState("all");

  const teams = Array.from(new Set(MOCK_SERVICES.map((s) => s.ownerTeam)));

  const filteredServices = MOCK_SERVICES.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.ownerTeam.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEnv =
      selectedEnv === "all" || service.environment.toLowerCase() === selectedEnv.toLowerCase();

    const matchesTeam = selectedTeam === "all" || service.ownerTeam === selectedTeam;

    return matchesSearch && matchesEnv && matchesTeam;
  });

  return (
    <AppShell>
      {/* Header Toolbar */}
      <ServiceCatalogHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedEnv={selectedEnv}
        onEnvChange={setSelectedEnv}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
        teams={teams}
        totalServicesCount={MOCK_SERVICES.length}
      />

      {/* Main Content Area */}
      {filteredServices.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-lg bg-slate-950/40">
          <Server className="h-10 w-10 text-slate-600 mb-3" />
          <h3 className="font-mono text-sm font-semibold text-slate-300">No Services Found</h3>
          <p className="font-mono text-xs text-slate-500 mt-1 max-w-sm">
            No registered microservices match your current filter parameters. Try clearing your search query or selecting "All Envs".
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <ServiceTable services={filteredServices} />
      )}
    </AppShell>
  );
}
