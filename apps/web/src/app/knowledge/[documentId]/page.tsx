"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { DocumentContentViewer } from "@/components/knowledge/DocumentContentViewer";
import { DocumentVectorChunks } from "@/components/knowledge/DocumentVectorChunks";
import { DocumentMetaSidebar } from "@/components/knowledge/DocumentMetaSidebar";
import { Button } from "@/components/ui/Button";
import { MOCK_KNOWLEDGE_DOCUMENTS } from "@/mocks";
import {
  BookOpen,
  ArrowLeft,
  Database,
  RefreshCw,
  FileText,
  User,
  Clock,
  CheckCircle2,
  Github,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentDetailPageProps {
  params: {
    documentId: string;
  };
}

export default function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  const doc = MOCK_KNOWLEDGE_DOCUMENTS.find(
    (d) => d.id === params.documentId || d.title.toLowerCase().includes(params.documentId.toLowerCase())
  );

  const [activeTab, setActiveTab] = useState<"content" | "vector_chunks">("content");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!doc) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center p-12 text-center border border-slate-800 rounded-lg">
          <BookOpen className="h-10 w-10 text-slate-600 mb-2" />
          <h2 className="font-mono text-base font-bold text-slate-200">Knowledge Document Not Found</h2>
          <p className="font-mono text-xs text-slate-400 mt-1 mb-4">
            No engineering document or runbook matches ID "{params.documentId}".
          </p>
          <Link href="/knowledge">
            <Button variant="secondary" size="sm" className="gap-1 font-mono">
              <ArrowLeft className="h-4 w-4" /> Return to Knowledge Base
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const handleReindex = () => {
    setToastMessage(`Triggered background vector re-indexing for ${doc.title}...`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <AppShell>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-brand/40 bg-surface/95 px-4 py-3 shadow-2xl backdrop-blur-md font-mono text-xs text-slate-100">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Back Breadcrumb */}
      <div className="space-y-4 border-b border-slate-800/80 pb-5">
        <Link
          href="/knowledge"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Knowledge Base</span>
        </Link>

        {/* Title Bar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap font-mono">
              <span
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  doc.type === "runbook" && "bg-amber-950 text-amber-300 border border-amber-800/40",
                  doc.type === "postmortem" && "bg-red-950 text-red-400 border border-red-800/40",
                  doc.type === "architecture_doc" && "bg-blue-950 text-blue-300 border border-blue-800/40"
                )}
              >
                {doc.type.replace("_", " ")}
              </span>

              <span className="rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 text-[10px] font-bold">
                Qdrant Indexed ({doc.vectorChunksCount} Chunks)
              </span>
            </div>

            <h1 className="font-mono text-xl font-bold text-slate-100">{doc.title}</h1>
            <p className="text-xs text-slate-400 font-sans max-w-3xl">{doc.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReindex} className="gap-1.5 font-mono">
              <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
              <span>Re-index Vectors</span>
            </Button>
          </div>
        </div>

        {/* Sub Tabs Navigation */}
        <div className="flex items-center gap-1 border-t border-slate-800/60 pt-4 font-mono text-xs">
          <button
            onClick={() => setActiveTab("content")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors",
              activeTab === "content"
                ? "bg-slate-800 text-brand-light font-bold border border-slate-700/60"
                : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
            )}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Document Content</span>
          </button>

          <button
            onClick={() => setActiveTab("vector_chunks")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors",
              activeTab === "vector_chunks"
                ? "bg-slate-800 text-brand-light font-bold border border-slate-700/60"
                : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
            )}
          >
            <Database className="h-3.5 w-3.5" />
            <span>Qdrant RAG Chunks ({doc.vectorChunksCount})</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 pt-2">
        {/* Left Column (2/3 width) */}
        <div className="space-y-6 lg:col-span-2">
          {activeTab === "content" && (
            <DocumentContentViewer contentMarkdown={doc.contentMarkdown} title={doc.title} />
          )}
          {activeTab === "vector_chunks" && (
            <DocumentVectorChunks chunks={doc.vectorChunks} documentId={doc.id} />
          )}
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          <DocumentMetaSidebar document={doc} />
        </div>
      </div>
    </AppShell>
  );
}
