import { useState, useCallback } from "react";
import { fetchFromApi } from "@/lib/api-client";
import { VectorChunkPreview } from "@aegis/types";

export interface RagSearchResultItem {
  chunk: VectorChunkPreview;
  documentId: string;
  documentTitle: string;
  similarityScore: number;
}

export interface RagSearchResponse {
  query: string;
  resultsCount: number;
  results: RagSearchResultItem[];
}

export function useRagSearch() {
  const [results, setResults] = useState<RagSearchResultItem[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const searchVector = useCallback(async (query: string, topK = 5) => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      return;
    }

    setSearching(true);
    setError(undefined);

    const res = await fetchFromApi<RagSearchResponse>("/rag/search", {
      query,
      resultsCount: 0,
      results: [],
    }, {
      method: "POST",
      body: JSON.stringify({ query, topK }),
    });

    if (res.data && res.data.results) {
      setResults(res.data.results);
    }
    setError(res.error);
    setSearching(false);
  }, []);

  const triggerIngest = useCallback(async (documentId: string) => {
    const res = await fetchFromApi<any>("/rag/ingest", null, {
      method: "POST",
      body: JSON.stringify({ documentId }),
    });
    return res;
  }, []);

  return { results, searching, error, searchVector, triggerIngest };
}
