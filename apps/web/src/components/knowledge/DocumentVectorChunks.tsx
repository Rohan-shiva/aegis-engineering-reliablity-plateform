import React from "react";
import { VectorChunkPreview } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Database, FileCode, Layers, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentVectorChunksProps {
  chunks?: VectorChunkPreview[];
  documentId: string;
}

export const DocumentVectorChunks: React.FC<DocumentVectorChunksProps> = ({
  chunks = [],
  documentId,
}) => {
  return (
    <Card variant="default">
      <CardHeader className="border-b border-slate-800/80 pb-3">
        <CardTitle className="text-sm font-mono flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-400" />
          Qdrant Vector Chunks ({chunks.length} Embedding Splices)
        </CardTitle>
        <CardDescription>Dense vector embeddings chunked for RAG semantic retrieval ($1536$-dim vectors)</CardDescription>
      </CardHeader>

      <CardContent className="p-4 space-y-3 font-mono text-xs">
        {chunks.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 font-mono">
            No vector chunk previews available for this document yet. Ingestion pipeline is currently processing.
          </div>
        ) : (
          chunks.map((chunk) => (
            <div
              key={chunk.id}
              className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 space-y-2 transition-colors hover:border-slate-700"
            >
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-brand/20 border border-brand/40 px-2 py-0.5 font-bold text-brand-light">
                    Chunk #{chunk.chunkIndex}
                  </span>
                  <span className="text-slate-400 font-semibold">{chunk.section}</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>{chunk.tokenCount} tokens</span>
                  <span>•</span>
                  <span className="text-emerald-400">{chunk.embeddingVectorDimension}d vector</span>
                </div>
              </div>

              <div className="rounded bg-slate-900/80 p-2.5 border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed">
                "{chunk.textSnippet}"
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
