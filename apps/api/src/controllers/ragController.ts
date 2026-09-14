import { Request, Response, NextFunction } from "express";
import { DocumentChunker } from "../rag/chunker";
import { VectorStore } from "../rag/vectorStore";
import { KnowledgeRepository } from "../repositories/knowledgeRepository";
import { sendSuccess } from "../utils/response";
import { BadRequestError, NotFoundError } from "../errors/AppError";

export async function ingestDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { documentId } = req.body;
    if (!documentId) {
      throw new BadRequestError("Missing required parameter: documentId");
    }

    const doc = await KnowledgeRepository.getById(documentId);
    if (!doc) {
      throw new NotFoundError(`Knowledge document with ID '${documentId}' not found`);
    }

    // Perform recursive chunking
    const chunks = DocumentChunker.chunkDocument(doc.id, doc.contentMarkdown);

    // Index vector chunks
    for (const chunk of chunks) {
      VectorStore.upsertChunk(doc.id, doc.title, chunk);
    }

    sendSuccess(res, {
      documentId: doc.id,
      documentTitle: doc.title,
      ingestedChunksCount: chunks.length,
      status: "indexed",
      vectorDimension: 1536,
      chunks,
    });
  } catch (error) {
    next(error);
  }
}

export async function searchVectors(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { query, topK = 5 } = req.body;
    if (!query) {
      throw new BadRequestError("Missing required search parameter: query");
    }

    // Ensure mock documents are seeded in VectorStore if empty
    if (VectorStore.getVectorCount() === 0) {
      const allDocs = await KnowledgeRepository.getAll();
      for (const doc of allDocs) {
        const chunks = DocumentChunker.chunkDocument(doc.id, doc.contentMarkdown);
        for (const chunk of chunks) {
          VectorStore.upsertChunk(doc.id, doc.title, chunk);
        }
      }
    }

    const searchResults = VectorStore.searchSimilar(query, Number(topK));
    sendSuccess(res, {
      query,
      resultsCount: searchResults.length,
      results: searchResults,
    });
  } catch (error) {
    next(error);
  }
}
