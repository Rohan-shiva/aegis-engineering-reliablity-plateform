import { VectorChunkPreview } from "@aegis/types";

export interface ChunkOptions {
  targetChunkSizeChars?: number;
  overlapChars?: number;
}

export class DocumentChunker {
  public static chunkDocument(
    documentId: string,
    contentMarkdown: string,
    options?: ChunkOptions
  ): VectorChunkPreview[] {
    const targetSize = options?.targetChunkSizeChars || 1500;
    const overlap = options?.overlapChars || 300;

    if (!contentMarkdown || contentMarkdown.trim().length === 0) {
      return [];
    }

    const lines = contentMarkdown.split("\n");
    const chunks: VectorChunkPreview[] = [];
    let currentChunkText = "";
    let currentSection = "General Overview";
    let chunkIndex = 1;

    for (const line of lines) {
      if (line.startsWith("#")) {
        const headerText = line.replace(/^#+\s*/, "").trim();
        if (headerText) currentSection = headerText;
      }

      if (currentChunkText.length + line.length > targetSize && currentChunkText.length > 0) {
        chunks.push({
          id: `chk-${documentId}-${chunkIndex}`,
          chunkIndex,
          textSnippet: currentChunkText.trim(),
          tokenCount: Math.ceil(currentChunkText.trim().length / 4),
          embeddingVectorDimension: 1536,
          section: currentSection,
        });
        chunkIndex++;
        // Retain overlap from end of previous chunk
        currentChunkText = currentChunkText.slice(-overlap) + "\n" + line;
      } else {
        currentChunkText += (currentChunkText ? "\n" : "") + line;
      }
    }

    if (currentChunkText.trim().length > 0) {
      chunks.push({
        id: `chk-${documentId}-${chunkIndex}`,
        chunkIndex,
        textSnippet: currentChunkText.trim(),
        tokenCount: Math.ceil(currentChunkText.trim().length / 4),
        embeddingVectorDimension: 1536,
        section: currentSection,
      });
    }

    return chunks;
  }
}
