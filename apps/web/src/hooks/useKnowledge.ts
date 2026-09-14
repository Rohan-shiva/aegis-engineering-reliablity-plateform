import { useState, useEffect, useCallback } from "react";
import { KnowledgeDocument } from "@aegis/types";
import { MOCK_KNOWLEDGE_DOCUMENTS } from "@/mocks/knowledge";
import { fetchFromApi } from "@/lib/api-client";

export interface UseKnowledgeOptions {
  type?: string;
  status?: string;
  search?: string;
}

export function useKnowledge(options?: UseKnowledgeOptions) {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchKnowledge = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (options?.type && options.type !== "all") params.append("type", options.type);
    if (options?.status && options.status !== "all") params.append("status", options.status);
    if (options?.search) params.append("search", options.search);
    const queryString = params.toString() ? `?${params.toString()}` : "";

    let filteredMocks = [...MOCK_KNOWLEDGE_DOCUMENTS];
    if (options?.type && options.type !== "all") {
      filteredMocks = filteredMocks.filter((d) => d.type === options.type);
    }
    if (options?.status && options.status !== "all") {
      filteredMocks = filteredMocks.filter((d) => d.ingestionStatus === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      filteredMocks = filteredMocks.filter((d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
    }

    const res = await fetchFromApi<KnowledgeDocument[]>(`/knowledge${queryString}`, filteredMocks);
    setDocuments(res.data);
    setIsLive(res.isLive);
    setError(res.error);
    setLoading(false);
  }, [options?.type, options?.status, options?.search]);

  useEffect(() => {
    fetchKnowledge();
  }, [fetchKnowledge]);

  return { documents, loading, isLive, error, refetch: fetchKnowledge };
}

export function useDocumentDetail(id: string) {
  const [document, setDocument] = useState<KnowledgeDocument | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchDocument = useCallback(async () => {
    setLoading(true);
    const mockMatch = MOCK_KNOWLEDGE_DOCUMENTS.find((d: KnowledgeDocument) => d.id === id);
    const res = await fetchFromApi<KnowledgeDocument | undefined>(`/knowledge/${id}`, mockMatch);
    setDocument(res.data);
    setIsLive(res.isLive);
    setError(res.error);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (id) fetchDocument();
  }, [id, fetchDocument]);

  return { document, loading, isLive, error, refetch: fetchDocument };
}
