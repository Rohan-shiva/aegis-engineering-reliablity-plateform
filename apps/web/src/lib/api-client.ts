import { ApiResponse, PaginationMeta } from "@aegis/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export interface FetchResult<T> {
  data: T;
  meta?: PaginationMeta;
  isLive: boolean;
  error?: string;
}

export async function fetchFromApi<T>(
  endpoint: string,
  fallbackData: T,
  options?: RequestInit
): Promise<FetchResult<T>> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[Aegis API] Non-200 response (${res.status}) from ${url}. Using mock fallback.`);
      return { data: fallbackData, isLive: false, error: `HTTP ${res.status}` };
    }

    const payload: ApiResponse<T> = await res.json();
    if (!payload.success) {
      console.warn(`[Aegis API] Unsuccessful payload from ${url}. Using mock fallback.`);
      return { data: fallbackData, isLive: false, error: "API Payload Error" };
    }

    return {
      data: payload.data,
      meta: payload.meta,
      isLive: true,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    console.info(`[Aegis API] Live backend unreachable at ${url} (${msg}). Serving fallback data.`);
    return {
      data: fallbackData,
      isLive: false,
      error: msg,
    };
  }
}
