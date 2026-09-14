"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { DocumentContentViewer } from "@/components/knowledge/DocumentContentViewer";
import { DocumentVectorChunks } from "@/components/knowledge/DocumentVectorChunks";
import { DocumentMetaSidebar } from "@/components/knowledge/DocumentMetaSidebar";
import { Button } from "@/components/ui/Button";
import { useDocumentDetail } from "@/hooks/useKnowledge";
import { useRagSearch } from "@/hooks/useRagSearch";
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
  const { document: doc, loading, isLive } = useDocumentDetail(params.documentId);
  const { triggerIngest } = useRagSearch();

  const [activeTab, setActiveTab] = useState<"content" | "vector_chunks">("content");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isReindexing, setIsReindexing] = useState(false);

  if (loading) {
    return (
      <AppShell isLive={isLive}>
        <div className="flex flex-col items-center justify-center p-12 text-center border border-slate-800 rounded-lg animate-pulse">
          <BookOpen className="h-8 w-8 text-slate-600 mb-2" />
          <h2 className="font-mono text-sm font-bold text-slate-400">Loading Document & Vector Chunks...</h2>
        </div>
      </AppShell>
    );
  }

  if (!doc) {
    return (
      <AppShell isLive={isLive}>
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

  const handleReindex = async () => {
    setIsReindexing(true);
    setToastMessage(`Triggering vector chunking for ${doc.title}...`);
    try {
      const res = await triggerIngest(doc.id);
      if (res && res.data) {
        setToastMessage(`Vector ingestion complete (${res.data.ingestedChunksCount} chunks indexed).`);
      } else {
        setToastMessage(`Triggered local vector re-indexing for ${doc.title}.`);
      }
    } catch {
      setToastMessage(`Triggered vector re-indexing for ${doc.title}.`);
    } finally {
      setIsReindexing(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <AppShell isLive={isLive}>
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
            <p className="text-xs text-slate-400">{doc.description}</p>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReindex}
              disabled={isReindexing}
              className="text-xs border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5 text-brand-light", isReindexing && "animate-spin")} />
              Re-index Vector Chunks
            </Button>
          </div>
        </div>

        {/* Author / Timestamp Subheader */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-slate-500" />
            <span>{doc.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>Updated {doc.updatedAt}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Github className="h-3.5 w-3.5 text-slate-500" />
            <span>{doc.source}</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-800 font-mono text-xs">
        <button
          onClick={() => setActiveTab("content")}
          className={cn(
            "flex items-center gap-2 border-b-2 px-4 py-2.5 font-medium transition-colors",
            activeTab === "content"
              ? "border-brand text-brand-light bg-brand/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          )}
        >
          <FileText className="h-4 w-4" />
          <span>Markdown Content</span>
        </button>

        <button
          onClick={() => setActiveTab("vector_chunks")}
          className={cn(
            "flex items-center gap-2 border-b-2 px-4 py-2.5 font-medium transition-colors",
            activeTab === "vector_chunks"
              ? "border-brand text-brand-light bg-brand/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          )}
        >
          <Database className="h-4 w-4" />
          <span>Qdrant Vector Chunks ({doc.vectorChunksCount})</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          {activeTab === "content" ? (
            <DocumentContentViewer contentMarkdown={doc.contentMarkdown} title={doc.title} />
          ) : (
            <DocumentVectorChunks chunks={doc.vectorChunks || []} documentId={doc.id} />
          )}
        </div>

        <div className="lg:col-span-4">
          <DocumentMetaSidebar document={doc} />
        </div>
      </div>
    </AppShell>
  );
}
