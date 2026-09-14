import { VectorChunkPreview } from "@aegis/types";
import { VectorEmbedder } from "./vectorEmbedder";

export interface VectorRecord {
  chunk: VectorChunkPreview;
  embedding: number[];
  documentId: string;
  documentTitle: string;
}

export interface SearchResult {
  chunk: VectorChunkPreview;
  documentId: string;
  documentTitle: string;
  similarityScore: number;
}

export class VectorStore {
  private static records: VectorRecord[] = [];

  public static upsertChunk(
    documentId: string,
    documentTitle: string,
    chunk: VectorChunkPreview,
    embedding?: number[]
  ): void {
    const vector = embedding || VectorEmbedder.generateEmbedding(chunk.textSnippet);
    // Remove existing if present
    this.records = this.records.filter((r) => r.chunk.id !== chunk.id);
    this.records.push({
      documentId,
      documentTitle,
      chunk,
      embedding: vector,
    });
  }

  public static searchSimilar(queryText: string, topK = 5): SearchResult[] {
    if (this.records.length === 0) return [];

    const queryVector = VectorEmbedder.generateEmbedding(queryText);
    const results: SearchResult[] = [];

    for (const record of this.records) {
      const score = this.calculateCosineSimilarity(queryVector, record.embedding);
      results.push({
        chunk: record.chunk,
        documentId: record.documentId,
        documentTitle: record.documentTitle,
        similarityScore: Number(score.toFixed(4)),
      });
    }

    results.sort((a, b) => b.similarityScore - a.similarityScore);
    return results.slice(0, topK);
  }

  private static calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    const len = Math.min(vecA.length, vecB.length);

    for (let i = 0; i < len; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dot / denominator;
  }

  public static getVectorCount(): number {
    return this.records.length;
  }
}
