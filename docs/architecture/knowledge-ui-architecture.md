# Aegis Architecture — Knowledge UI & RAG Pipeline (Day 6)

## Overview

Day 6 introduces the Knowledge Intelligence Module, establishing the Knowledge Base Catalog (`/knowledge`) and Document Detail Views (`/knowledge/[documentId]`) for semantic vector indexing, operational runbook lookup, incident postmortem auditing, and RAG chunk inspection.

---

## Routing & Layout Architecture

```
apps/web/src/app/knowledge/
├── page.tsx                           # Knowledge Base Catalog Route (/knowledge)
└── [documentId]/
    └── page.tsx                       # Document Detail & Vector Viewer Route (/knowledge/[documentId])
```

- **`page.tsx` (`/knowledge`)**: Searchable document catalog supporting **Type Filters** (`runbook`, `postmortem`, `architecture_doc`), **Ingestion Status Filters** (`indexed`, `indexing`, `failed`), and **View Mode Toggles** (`Grid` vs `Table`).
- **`[documentId]/page.tsx` (`/knowledge/[documentId]`)**: Comprehensive document viewer rendering source markdown, Qdrant vector chunk embeddings preview, and linked microservice/incident metadata.

---

## RAG Ingestion Pipeline Flow

```
   [ Document Source ] (Markdown / PDF / GitHub / Confluence)
           │
           ▼
   [ Text Cleaning & Normalization ]
           │
           ▼
   [ Semantic Text Chunking ] (100 - 500 tokens per chunk with metadata)
           │
           ▼
   [ Embedding Vector Generation ] (OpenAI / local embedding model -> 1536-dim vector)
           │
           ▼
   [ Vector Database Ingestion ] (Qdrant collection index)
           │
           ▼
   [ Semantic Query Retrieval ] (AI Investigator & Knowledge Search)
```

---

## Component Taxonomy (`apps/web/src/components/knowledge/`)

- **`KnowledgeCatalogHeader`**: Search bar, document type filter pills, ingestion status dropdown, and "Upload Document" button.
- **`KnowledgeCard`**: Visual card displaying document type badges, Qdrant indexing status pills, vector chunk counts, and tag pills.
- **`KnowledgeTable`**: Tabular list for high-density document auditing.
- **`DocumentContentViewer`**: Formatted markdown viewer for reading runbooks and postmortems.
- **`DocumentVectorChunks`**: Vector chunk previewer displaying 1536-dim Qdrant embedding splices, token counts, and section references.
- **`DocumentMetaSidebar`**: Qdrant indexing metadata, linked microservice badges, related incident shortcuts, and tag lists.
