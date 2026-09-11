import { AIInvestigation } from "@/types/domain";

export const MOCK_INVESTIGATIONS: AIInvestigation[] = [
  {
    id: "inv-101",
    title: "Root Cause Investigation — INC-8492 Payment Checkout 500 Spike",
    targetIncidentCode: "INC-8492",
    targetServiceName: "payment-gateway",
    status: "completed",
    confidenceScore: 89,
    createdAt: "14 minutes ago",
    updatedAt: "2 minutes ago",
    plannerThought:
      "Incident alert triggered on payment-gateway 500 error spike. Step 1: Queried recent deployments (found commit a8f9c1d by alex.dev). Step 2: Inspected Prometheus telemetry metrics (found 14.2% error rate). Step 3: Executed Loki log query for payment-gateway (found PostgreSQL lock timeout on ledger_entries table). Step 4: Cross-referenced Qdrant knowledge vector base for rollback runbook.",
    hypotheses: [
      {
        id: "hyp-1",
        rank: 1,
        title: "PostgreSQL Database Connection Pool Exhaustion via Migration Lock Contention",
        confidencePercentage: 89,
        reasoningText:
          "Deployment commit a8f9c1d executed an un-indexed CREATE INDEX CONCURRENTLY on ledger_entries. This locked user balance rows and caused active HTTP handler threads in payment-gateway to block indefinitely, exhausting the PostgreSQL connection pool (error code 53300).",
        isPrimary: true,
        evidenceCategory: "Database Migration & Telemetry Correlation",
      },
      {
        id: "hyp-2",
        rank: 2,
        title: "Stripe Third-Party Webhook API Rate Limiting",
        confidencePercentage: 11,
        reasoningText:
          "Secondary hypothesis that Stripe API endpoints throttled outbound requests. Unlikely as direct internal 500 logs point to local database timeouts.",
        isPrimary: false,
        evidenceCategory: "External API Integration",
      },
    ],
    toolCalls: [
      {
        id: "tool-1",
        toolName: "getRecentDeployments",
        args: { serviceId: "srv-payment", limit: 5 },
        status: "success",
        executionTimeMs: 42,
        resultSummary: "Found commit a8f9c1d by alex.dev deployed 14 mins ago (Risk Score: 82/100 HIGH RISK)",
      },
      {
        id: "tool-2",
        toolName: "queryLogs",
        args: { serviceName: "payment-gateway", level: "error", timeframe: "30m" },
        status: "success",
        executionTimeMs: 120,
        resultSummary: "1,420 occurrences of 'FATAL: remaining connection slots are reserved for non-replication superuser connections'",
      },
      {
        id: "tool-3",
        toolName: "searchKnowledge",
        args: { query: "payment gateway postgresql rollback runbook" },
        status: "success",
        executionTimeMs: 85,
        resultSummary: "Retrieved doc-101 'Payment Gateway Rollback & Recovery Runbook' from Qdrant vector database (100% match)",
      },
      {
        id: "tool-4",
        toolName: "getServiceDependencies",
        args: { serviceId: "srv-payment" },
        status: "success",
        executionTimeMs: 38,
        resultSummary: "Identified order-processor as direct upstream caller affected by latency cascade",
      },
    ],
    citations: [
      {
        id: "cit-1",
        title: "Payment Gateway Rollback & Recovery Runbook",
        url: "/knowledge/doc-101",
        type: "runbook",
        relevanceScore: 0.98,
      },
      {
        id: "cit-2",
        title: "Deployment Commit a8f9c1d by alex.dev",
        url: "/deployments/dep-101",
        type: "commit",
        relevanceScore: 0.94,
      },
      {
        id: "cit-3",
        title: "Grafana Loki Connection Pool Log Stream",
        url: "/incidents/inc-8492",
        type: "log",
        relevanceScore: 0.91,
      },
    ],
    recommendedActions: [
      "Execute automated canary rollback to deployment tag v2.4.1 for payment-gateway.",
      "Run 'SELECT pg_terminate_backend(pid)' to release blocked database connection locks.",
      "Update database migration pipeline rules to prevent un-tested concurrent index locks in production.",
    ],
  },
  {
    id: "inv-102",
    title: "Queue Lag Investigation — INC-8490 BullMQ Backpressure",
    targetIncidentCode: "INC-8490",
    targetServiceName: "order-processor",
    status: "completed",
    confidenceScore: 74,
    createdAt: "45 minutes ago",
    updatedAt: "20 minutes ago",
    plannerThought:
      "BullMQ queue depth reached 45,000 items. Step 1: Checked worker concurrency settings. Step 2: Queried Redis memory allocation metrics. Step 3: Verified worker container CPU utilization in AWS ECS.",
    hypotheses: [
      {
        id: "hyp-10",
        rank: 1,
        title: "Redis Session Cache Memory Saturation & Worker Thread Starvation",
        confidencePercentage: 74,
        reasoningText:
          "High volume hourly batch order spike exceeded worker pool concurrency (10 tasks). Redis memory reached 85% capacity, causing delay in job lock renewal.",
        isPrimary: true,
        evidenceCategory: "Queue Telemetry & Redis Metrics",
      },
    ],
    toolCalls: [
      {
        id: "tool-10",
        toolName: "getServiceDependencies",
        args: { serviceId: "srv-order" },
        status: "success",
        executionTimeMs: 32,
        resultSummary: "Found notification-worker downstream queue listener",
      },
    ],
    citations: [
      {
        id: "cit-10",
        title: "BullMQ Queue Scaling Runbook",
        url: "/knowledge/doc-103",
        type: "runbook",
        relevanceScore: 0.92,
      },
    ],
    recommendedActions: [
      "Scale worker pool concurrency from 10 to 25 tasks.",
      "Verify Redis eviction policy is set to volatile-ttl.",
    ],
  },
  {
    id: "inv-103",
    title: "Active Analysis — Qdrant Vector Latency Degradation",
    targetIncidentCode: "INC-8488",
    targetServiceName: "recommendation-engine",
    status: "analyzing",
    confidenceScore: 62,
    createdAt: "10 minutes ago",
    updatedAt: "Just now",
    plannerThought:
      "Qdrant vector query p99 latency exceeded 450ms. Currently inspecting HNSW index M parameter changes in recent commits and benchmarking vector collection search depth...",
    hypotheses: [
      {
        id: "hyp-20",
        rank: 1,
        title: "HNSW Vector Index Search Depth Saturation under Concurrent Batch Queries",
        confidencePercentage: 62,
        reasoningText:
          "HNSW index construction parameter ef_construct was updated without increasing vector payload cache size.",
        isPrimary: true,
        evidenceCategory: "Vector Database Profiling",
      },
    ],
    toolCalls: [
      {
        id: "tool-20",
        toolName: "searchKnowledge",
        args: { query: "qdrant index hnsw tuning" },
        status: "success",
        executionTimeMs: 65,
        resultSummary: "Retrieved doc-105 Qdrant Index Tuning Guide",
      },
    ],
    citations: [],
    recommendedActions: [
      "Flush vector payload search cache.",
      "Re-balance Qdrant collection index.",
    ],
  },
];
