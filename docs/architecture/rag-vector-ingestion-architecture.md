# RAG Ingestion Pipeline & Vector Search Architecture

This document details the **Retrieval-Augmented Generation (RAG)** architecture for the **Aegis** platform (`apps/api/src/rag`), including recursive document chunking, $1536$-dim vector embedding generation, cosine similarity ranking formulas, and REST API search contracts.

---

## 1. Overview & Data Pipeline

```
┌─────────────────────────┐          ┌─────────────────────────┐
│ Technical Document      │ ───────> │  DocumentChunker        │
│ (Runbook / Postmortem)  │          │  (~500 tokens / chunk)  │
└─────────────────────────┘          └────────────┬────────────┘
                                                  │
                                                  ▼
┌─────────────────────────┐          ┌─────────────────────────┐
│ Cosine Similarity Search│ <─────── │  VectorEmbedder         │
│ VectorStore (1536-dim)  │          │  1536-dim Float Array   │
└─────────────────────────┘          └─────────────────────────┘
```

---

## 2. Mathematical Cosine Similarity Model

The semantic retrieval engine calculates the cosine angle between query vector $\mathbf{A}$ and chunk embedding $\mathbf{B}$:

$$\text{Similarity}(\mathbf{A}, \mathbf{B}) = \cos(\theta) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|} = \frac{\sum_{i=1}^{1536} A_i B_i}{\sqrt{\sum_{i=1}^{1536} A_i^2} \sqrt{\sum_{i=1}^{1536} B_i^2}}$$

- **Score Range**: $0.0$ (no similarity) to $1.0$ (identical semantic match).
- **Target Dimension**: $1536$-dimensional vector space.

---

## 3. RAG REST API Endpoints (`/api/v1/rag/*`)

### `POST /api/v1/rag/ingest`
Triggers recursive text chunking and vector indexing for a given document.

**Request**:
```json
{
  "documentId": "kb-201"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "documentId": "kb-201",
    "documentTitle": "Payment Checkout Connection Pool Runbook",
    "ingestedChunksCount": 6,
    "status": "indexed",
    "vectorDimension": 1536
  }
}
```

### `POST /api/v1/rag/search`
Executes semantic vector similarity search against all indexed document chunks.

**Request**:
```json
{
  "query": "Postgres connection pool starvation",
  "topK": 5
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "query": "Postgres connection pool starvation",
    "resultsCount": 2,
    "results": [
      {
        "documentId": "kb-201",
        "documentTitle": "Payment Checkout Connection Pool Runbook",
        "similarityScore": 0.9421,
        "chunk": {
          "id": "chk-kb-201-1",
          "section": "Emergency Payment Triage Procedure",
          "tokenCount": 128,
          "textSnippet": "1. Inspect active connection pools..."
        }
      }
    ]
  }
}
```
