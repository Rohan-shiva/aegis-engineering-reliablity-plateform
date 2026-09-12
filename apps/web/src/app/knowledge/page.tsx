"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { KnowledgeCatalogHeader } from "@/components/knowledge/KnowledgeCatalogHeader";
import { KnowledgeCard } from "@/components/knowledge/KnowledgeCard";
import { KnowledgeTable } from "@/components/knowledge/KnowledgeTable";
import { useKnowledge } from "@/hooks/useKnowledge";
import { SkeletonGrid } from "@/components/common/SkeletonCard";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { BookOpen } from "lucide-react";

export default function KnowledgeCatalogPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { documents, loading, isLive } = useKnowledge({
    type: selectedType,
    status: selectedStatus,
    search: searchQuery,
  });

  const indexedCount = documents.filter((d) => d.ingestionStatus === "indexed").length;

  return (
    <AppShell isLive={isLive}>
      {/* Header Toolbar */}
      <KnowledgeCatalogHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        totalDocsCount={documents.length}
        indexedCount={indexedCount}
      />

      {/* Main Content */}
      {loading ? (
        viewMode === "grid" ? <SkeletonGrid count={6} /> : <TableSkeleton rows={6} />
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-lg bg-slate-950/40">
          <BookOpen className="h-10 w-10 text-slate-600 mb-3" />
          <h3 className="font-mono text-sm font-semibold text-slate-300">No Knowledge Documents Found</h3>
          <p className="font-mono text-xs text-slate-500 mt-1 max-w-sm">
            No engineering runbooks or postmortems match your current filter parameters. Try clearing your search query or selecting "All Document Types".
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <KnowledgeCard key={doc.id} document={doc} />
          ))}
        </div>
      ) : (
        <KnowledgeTable documents={documents} />
      )}
    </AppShell>
  );
}
