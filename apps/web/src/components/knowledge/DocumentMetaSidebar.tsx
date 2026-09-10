import React from "react";
import Link from "next/link";
import { KnowledgeDocument } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Server, AlertTriangle, User, Database, Tag, ExternalLink, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentMetaSidebarProps {
  document: KnowledgeDocument;
}

export const DocumentMetaSidebar: React.FC<DocumentMetaSidebarProps> = ({ document: doc }) => {
  return (
    <div className="space-y-4 font-mono text-xs">
      {/* RAG Ingestion Status Card */}
      <Card variant="bordered" className="border-brand/30 bg-slate-900/40">
        <CardHeader className="pb-2 border-b border-slate-800">
          <CardTitle className="text-xs uppercase tracking-wider text-brand-light flex items-center gap-2">
            <Database className="h-4 w-4 text-brand" />
            Qdrant Vector Indexing
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[10px]">Ingestion State</span>
            <span
              className={cn(
                "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                doc.ingestionStatus === "indexed" && "bg-emerald-950 text-emerald-400 border border-emerald-800/40",
                doc.ingestionStatus === "indexing" && "bg-amber-950 text-amber-300 border border-amber-800/40 animate-pulse",
                doc.ingestionStatus === "failed" && "bg-red-950 text-red-400 border border-red-800/40"
              )}
            >
              {doc.ingestionStatus}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[10px]">Vector Chunks</span>
            <span className="text-slate-200 font-bold">{doc.vectorChunksCount} Chunks</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[10px]">File Size</span>
            <span className="text-slate-200 font-bold">{doc.fileSize}</span>
          </div>
        </CardContent>
      </Card>

      {/* Linked Microservices */}
      {doc.linkedServices && doc.linkedServices.length > 0 && (
        <Card variant="default">
          <CardHeader className="border-b border-slate-800/80 pb-3">
            <CardTitle className="text-xs uppercase tracking-wider text-slate-400">
              Linked Microservices ({doc.linkedServices.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {doc.linkedServices.map((srv) => (
              <div key={srv} className="flex items-center justify-between p-2.5 rounded-md border border-slate-800 bg-slate-900/40">
                <div className="flex items-center gap-2">
                  <Server className="h-3.5 w-3.5 text-brand-light" />
                  <span className="font-bold text-slate-200">{srv}</span>
                </div>
                <Link href={`/services/${srv}`} className="text-[10px] text-brand-light hover:underline">
                  Inspect →
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Linked Incidents */}
      {doc.linkedIncidents && doc.linkedIncidents.length > 0 && (
        <Card variant="default">
          <CardHeader className="border-b border-slate-800/80 pb-3">
            <CardTitle className="text-xs uppercase tracking-wider text-slate-400">
              Linked Incidents ({doc.linkedIncidents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {doc.linkedIncidents.map((incCode) => (
              <div key={incCode} className="flex items-center justify-between p-2.5 rounded-md border border-red-900/40 bg-red-950/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                  <span className="font-bold text-slate-200">{incCode}</span>
                </div>
                <Link href={`/incidents/${incCode.toLowerCase()}`} className="text-[10px] text-red-300 hover:underline">
                  Room →
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      <Card variant="default">
        <CardHeader className="border-b border-slate-800/80 pb-3">
          <CardTitle className="text-xs uppercase tracking-wider text-slate-400">
            Document Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-1.5">
            {doc.tags.map((tag) => (
              <span key={tag} className="rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-300 border border-slate-700/60">
                #{tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
