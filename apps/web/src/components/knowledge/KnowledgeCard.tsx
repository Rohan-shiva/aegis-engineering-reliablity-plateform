import React from "react";
import Link from "next/link";
import { KnowledgeDocument } from "@/types/domain";
import { Card } from "@/components/ui/Card";
import { BookOpen, FileText, Database, User, Clock, ArrowRight, Github, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface KnowledgeCardProps {
  document: KnowledgeDocument;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ document: doc }) => {
  return (
    <Card
      variant="hover"
      className="flex flex-col justify-between p-4 relative transition-all duration-200 group border border-slate-800/80 bg-slate-900/40 font-mono text-xs"
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider",
              doc.type === "runbook" && "bg-amber-950 text-amber-300 border border-amber-800/40",
              doc.type === "postmortem" && "bg-red-950 text-red-400 border border-red-800/40",
              doc.type === "architecture_doc" && "bg-blue-950 text-blue-300 border border-blue-800/40"
            )}
          >
            {doc.type.replace("_", " ")}
          </span>

          <span
            className={cn(
              "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold font-mono",
              doc.ingestionStatus === "indexed" && "text-emerald-400 bg-emerald-950/60 border border-emerald-800/40",
              doc.ingestionStatus === "indexing" && "text-amber-300 bg-amber-950/60 border border-amber-800/40 animate-pulse",
              doc.ingestionStatus === "failed" && "text-red-400 bg-red-950/60 border border-red-800/40"
            )}
          >
            {doc.ingestionStatus === "indexing" ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Database className="h-3 w-3" />}
            <span>{doc.ingestionStatus}</span>
          </span>
        </div>

        {/* Document Title & Description */}
        <div className="mt-3 space-y-1">
          <Link
            href={`/knowledge/${doc.id}`}
            className="font-mono text-sm font-bold text-slate-100 group-hover:text-brand-light transition-colors line-clamp-1 flex items-center justify-between"
          >
            <span>{doc.title}</span>
            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-light ml-2" />
          </Link>
          <p className="text-xs text-slate-400 font-sans line-clamp-2">{doc.description}</p>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
          {doc.tags.map((tag) => (
            <span key={tag} className="rounded bg-slate-800/90 border border-slate-700/60 px-2 py-0.5 text-slate-300">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3 text-slate-600" />
            {doc.author}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Database className="h-3 w-3 text-brand" />
            {doc.vectorChunksCount} Chunks
          </span>
        </div>

        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-slate-600" />
          {doc.updatedAt}
        </span>
      </div>
    </Card>
  );
};
