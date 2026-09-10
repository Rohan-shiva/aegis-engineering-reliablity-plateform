import React from "react";
import Link from "next/link";
import { KnowledgeDocument } from "@/types/domain";
import { ArrowRight, BookOpen, Database, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface KnowledgeTableProps {
  documents: KnowledgeDocument[];
}

export const KnowledgeTable: React.FC<KnowledgeTableProps> = ({ documents }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-800 bg-surface">
      <table className="w-full text-left font-mono text-xs">
        <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3">Document Title</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Qdrant RAG Status</th>
            <th className="px-4 py-3">Vector Chunks</th>
            <th className="px-4 py-3">Author</th>
            <th className="px-4 py-3">Updated</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {documents.map((doc) => (
            <tr key={doc.id} className="group hover:bg-slate-900/60 transition-colors">
              <td className="px-4 py-3.5 font-bold text-slate-200">
                <Link
                  href={`/knowledge/${doc.id}`}
                  className="group-hover:text-brand-light transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>{doc.title}</span>
                </Link>
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap">
                <span
                  className={cn(
                    "rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase",
                    doc.type === "runbook" && "bg-amber-950 text-amber-300 border border-amber-800/40",
                    doc.type === "postmortem" && "bg-red-950 text-red-400 border border-red-800/40",
                    doc.type === "architecture_doc" && "bg-blue-950 text-blue-300 border border-blue-800/40"
                  )}
                >
                  {doc.type.replace("_", " ")}
                </span>
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold font-mono",
                    doc.ingestionStatus === "indexed" && "text-emerald-400 bg-emerald-950/60 border border-emerald-800/40",
                    doc.ingestionStatus === "indexing" && "text-amber-300 bg-amber-950/60 border border-amber-800/40 animate-pulse",
                    doc.ingestionStatus === "failed" && "text-red-400 bg-red-950/60 border border-red-800/40"
                  )}
                >
                  <Database className="h-3 w-3" />
                  <span>{doc.ingestionStatus}</span>
                </span>
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap text-slate-300">
                {doc.vectorChunksCount} Chunks
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                {doc.author}
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                {doc.updatedAt}
              </td>

              <td className="px-4 py-3.5 whitespace-nowrap text-right">
                <Link
                  href={`/knowledge/${doc.id}`}
                  className="inline-flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-brand hover:text-white transition-colors"
                >
                  View <ArrowRight className="h-3 w-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
