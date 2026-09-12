"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DeploymentCatalogHeader } from "@/components/deployments/DeploymentCatalogHeader";
import { DeploymentCard } from "@/components/deployments/DeploymentCard";
import { DeploymentTable } from "@/components/deployments/DeploymentTable";
import { useDeployments } from "@/hooks/useDeployments";
import { SkeletonGrid } from "@/components/common/SkeletonCard";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { GitCommit } from "lucide-react";

export default function DeploymentsCatalogPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<"all" | "HIGH" | "MEDIUM" | "LOW">("all");
  const [selectedEnv, setSelectedEnv] = useState("all");

  const { deployments, loading, isLive } = useDeployments({
    environment: selectedEnv,
    search: searchQuery,
  });

  const filteredDeployments = deployments.filter((dep) => {
    return selectedRiskLevel === "all" || dep.riskLevel === selectedRiskLevel;
  });

  const highRiskCount = deployments.filter((d) => d.riskLevel === "HIGH").length;

  return (
    <AppShell isLive={isLive}>
      {/* Header Toolbar */}
      <DeploymentCatalogHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRiskLevel={selectedRiskLevel}
        onRiskLevelChange={setSelectedRiskLevel}
        selectedEnv={selectedEnv}
        onEnvChange={setSelectedEnv}
        totalDeploymentsCount={deployments.length}
        highRiskCount={highRiskCount}
      />

      {/* Main Content */}
      {loading ? (
        viewMode === "grid" ? <SkeletonGrid count={6} /> : <TableSkeleton rows={6} />
      ) : filteredDeployments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-lg bg-slate-950/40">
          <GitCommit className="h-10 w-10 text-slate-600 mb-3" />
          <h3 className="font-mono text-sm font-semibold text-slate-300">No Deployments Found</h3>
          <p className="font-mono text-xs text-slate-500 mt-1 max-w-sm">
            No deployment risk records match your current filter parameters. Try clearing your search query or setting Risk Level to "All Risk".
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeployments.map((deployment) => (
            <DeploymentCard key={deployment.id} deployment={deployment} />
          ))}
        </div>
      ) : (
        <DeploymentTable deployments={filteredDeployments} />
      )}
    </AppShell>
  );
}
