# Aegis Architecture — AI Investigator & Tool-Based Agent System (Day 7)

## Overview

Day 7 introduces the Autonomous AI Investigator Module, establishing the Investigations Catalog (`/investigations`) and Investigation Detail Rooms (`/investigations/[investigationId]`) for multi-tool evidence correlation, root cause hypotheses generation, auditable execution traces, and verifiable mitigation plans.

---

## Tool-Calling Agent Loop Architecture

```
   [ Telemetry Alert / Incident Trigger ]
                     │
                     ▼
            [ Agent Planner Loop ]
                     │
    ┌────────────────┴────────────────┐
    ▼                                 ▼
[ Tool 1: getRecentDeployments ]   [ Tool 2: queryLogs ]
    │                                 │
    └────────────────┬────────────────┘
                     ▼
           [ Evidence Synthesis ]
                     │
                     ▼
         [ Tool 3: searchKnowledge ] (Qdrant RAG Vector Match)
                     │
                     ▼
     [ Root Cause Hypothesis Ranking ] (Confidence % Scoring)
                     │
                     ▼
     [ Recommended Action & Citations ]
```

---

## Agent Tool Definitions

1. **`getRecentDeployments(serviceId, limit)`**: Fetches recent commit SHAs, author metadata, and change risk scores for the target microservice node.
2. **`queryLogs(serviceName, level, timeframe)`**: Queries Grafana Loki log aggregators for 5xx error spikes, connection pool lock timeouts, and stack trace tracebacks.
3. **`searchKnowledge(query)`**: Performs semantic vector retrieval across Qdrant vector database for relevant runbooks, postmortems, and architecture specs.
4. **`getServiceDependencies(serviceId)`**: Queries dependency graph map for upstream callers and downstream cascade targets.
5. **`getRunbook(runbookId)`**: Retrieves emergency mitigation steps for target microservice node.

---

## Component Taxonomy (`apps/web/src/components/investigations/`)

- **`InvestigationCatalogHeader`**: Search bar, agent status filter (`Completed`, `Analyzing`), target service filter, and "New Investigation" button.
- **`InvestigationCard`**: Visual card rendering confidence score pills, primary hypothesis summaries, and tool execution counts.
- **`InvestigationTable`**: High-density tabular view for AI agent run history.
- **`AIHypothesesPanel`**: Primary vs secondary root cause hypothesis cards with confidence percentages, detailed reasoning text, and observed vs inferred tags.
- **`AIToolExecutionTraces`**: Auditable execution log of autonomous tool invocations showing input arguments, execution latency ($ms$), and returned evidence summaries.
- **`AISidebarPanel`**: Recommended mitigation checklist and verifiable source citations (linking to exact commits, log streams, and runbooks).
