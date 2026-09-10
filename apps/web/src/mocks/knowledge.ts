import { KnowledgeDocument } from "@/types/domain";

export const MOCK_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: "doc-101",
    title: "Payment Gateway Rollback & Recovery Runbook",
    description: "Step-by-step emergency procedures for handling 500 error spikes and database index lock contention on payment-gateway.",
    type: "runbook",
    source: "github",
    author: "Marcus Vance",
    updatedAt: "2 days ago",
    ingestionStatus: "indexed",
    vectorChunksCount: 18,
    fileSize: "14.2 KB",
    tags: ["payment", "runbook", "rollback", "stripe"],
    linkedServices: ["payment-gateway", "order-processor"],
    linkedIncidents: ["INC-8492"],
    contentMarkdown: `
# Payment Gateway Emergency Rollback Runbook

## Overview
This runbook defines the emergency mitigation procedure when \`payment-gateway\` exhibits elevated HTTP 500 error rates ($>1.0\%$) or p99 response latency exceeds $500\text{ms}$.

## Emergency Triage Steps

### 1. Verify Alert Signals
- Inspect Prometheus alert **PaymentGatewayErrorRateHigh**.
- Check Grafana Loki logs for \`FATAL: remaining connection slots are reserved\` or \`PostgreSQL statement timeout\`.

### 2. Execute Canary Rollback
If the error spike correlates with a recent deployment (within the last 60 minutes):

\`\`\`bash
# Trigger automated ECS Fargate task rollback to previous revision
aegis-cli deployment rollback --service payment-gateway --target-revision v2.4.1
\`\`\`

### 3. Clear Stale Connection Locks
If database connection pool saturation is observed:

\`\`\`sql
-- Terminate blocked transactions waiting on index lock
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE wait_event_type = 'Lock' AND state = 'active';
\`\`\`
`,
    vectorChunks: [
      {
        id: "chunk-101-1",
        chunkIndex: 0,
        textSnippet: "Payment Gateway Emergency Rollback Runbook. Overview: This runbook defines emergency mitigation procedures when payment-gateway exhibits elevated HTTP 500 error rates (>1.0%) or p99 response latency exceeds 500ms.",
        tokenCount: 42,
        embeddingVectorDimension: 1536,
        section: "Overview",
      },
      {
        id: "chunk-101-2",
        chunkIndex: 1,
        textSnippet: "Emergency Triage Steps: 1. Verify Alert Signals. Inspect Prometheus alert PaymentGatewayErrorRateHigh. Check Grafana Loki logs for connection pool saturation.",
        tokenCount: 38,
        embeddingVectorDimension: 1536,
        section: "Emergency Triage Steps",
      },
      {
        id: "chunk-101-3",
        chunkIndex: 2,
        textSnippet: "Execute Canary Rollback: aegis-cli deployment rollback --service payment-gateway --target-revision v2.4.1. Clear Stale Connection Locks: SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE wait_event_type = 'Lock';",
        tokenCount: 45,
        embeddingVectorDimension: 1536,
        section: "Database Mitigation",
      },
    ],
  },
  {
    id: "doc-102",
    title: "Postmortem — INC-8492 Payment Checkout API Spike",
    description: "Root cause analysis, contributing factors, timeline, and preventive action items for the SEV-1 payment checkout outage.",
    type: "postmortem",
    source: "upload",
    author: "Elena Rostova",
    updatedAt: "1 day ago",
    ingestionStatus: "indexed",
    vectorChunksCount: 24,
    fileSize: "22.5 KB",
    tags: ["postmortem", "sev-1", "payment", "database"],
    linkedServices: ["payment-gateway", "order-processor", "user-db-cluster"],
    linkedIncidents: ["INC-8492"],
    contentMarkdown: `
# Incident Postmortem — INC-8492

**Date:** September 5, 2026  
**Severity:** SEV-1  
**Lead Investigator:** Marcus Vance  

## Executive Summary
On September 5 at 16:32 UTC, \`payment-gateway\` experienced a high HTTP 500 error rate spike reaching $14.2\%$. Total checkout throughput degraded for 18 minutes until automated canary rollback restored normal operations.

## Root Cause Analysis
Deployment commit \`a8f9c1d\` introduced a database index alteration (\`CREATE INDEX CONCURRENTLY\`) on the \`ledger_entries\` table. During migration execution, an un-indexed lock contention held exclusive row locks on user balance accounts, causing PostgreSQL connection pool saturation.

## Action Items
1. **[Preventative]** Enforce deterministic pre-deployment risk checks for all database migration scripts (+25 risk points).
2. **[Observability]** Lower alert evaluation interval for PostgreSQL lock contention from 5 minutes to 1 minute.
`,
    vectorChunks: [
      {
        id: "chunk-102-1",
        chunkIndex: 0,
        textSnippet: "Incident Postmortem INC-8492. Date: September 5, 2026. Severity: SEV-1. Lead Investigator: Marcus Vance. Executive Summary: payment-gateway experienced HTTP 500 error rate spike reaching 14.2%.",
        tokenCount: 40,
        embeddingVectorDimension: 1536,
        section: "Executive Summary",
      },
      {
        id: "chunk-102-2",
        chunkIndex: 1,
        textSnippet: "Root Cause Analysis: Deployment commit a8f9c1d introduced database index alteration on ledger_entries table. Migration execution created exclusive row locks causing PostgreSQL connection pool saturation.",
        tokenCount: 36,
        embeddingVectorDimension: 1536,
        section: "Root Cause Analysis",
      },
    ],
  },
  {
    id: "doc-103",
    title: "BullMQ Queue Scaling & Backpressure Runbook",
    description: "Operational playbook for adjusting Redis memory limits, worker thread pools, and handling queue backpressure.",
    type: "runbook",
    source: "github",
    author: "Elena Rostova",
    updatedAt: "3 days ago",
    ingestionStatus: "indexed",
    vectorChunksCount: 12,
    fileSize: "9.8 KB",
    tags: ["redis", "bullmq", "runbook", "queue"],
    linkedServices: ["order-processor", "notification-worker"],
    linkedIncidents: ["INC-8490"],
    contentMarkdown: `
# BullMQ Queue Backpressure Runbook

## Symptoms
- BullMQ queue depth $> 10,000$ items.
- Redis memory usage $> 80\%$ of instance allocation.

## Resolution Steps
1. Scale consumer worker instances in AWS ECS Fargate from 10 to 25 tasks.
2. Verify Redis eviction policy is set to \`volatile-ttl\`.
`,
    vectorChunks: [
      {
        id: "chunk-103-1",
        chunkIndex: 0,
        textSnippet: "BullMQ Queue Backpressure Runbook. Symptoms: BullMQ queue depth > 10,000 items. Redis memory usage > 80% allocation.",
        tokenCount: 25,
        embeddingVectorDimension: 1536,
        section: "Symptoms",
      },
    ],
  },
  {
    id: "doc-104",
    title: "Authentication Architecture & JWT Rotation Spec",
    description: "Technical design specification for OAuth2 session management, refresh token rotation, and RBAC authorization policies.",
    type: "architecture_doc",
    source: "confluence",
    author: "Sarah Miller",
    updatedAt: "1 week ago",
    ingestionStatus: "indexed",
    vectorChunksCount: 30,
    fileSize: "35.1 KB",
    tags: ["auth", "jwt", "architecture", "security"],
    linkedServices: ["auth-service", "user-db-cluster"],
    linkedIncidents: ["INC-8485"],
    contentMarkdown: `
# OAuth2 & JWT Refresh Token Rotation Specification

## Architecture Overview
The \`auth-service\` issues short-lived JWT access tokens ($15\text{ mins}$) alongside single-use refresh tokens stored in Redis session cache.
`,
    vectorChunks: [],
  },
  {
    id: "doc-105",
    title: "Qdrant Vector Database HNSW Tuning Guide",
    description: "Performance optimization guide for tuning Qdrant vector index HNSW parameters (M, ef_construct) for sub-50ms p99 vector retrieval.",
    type: "architecture_doc",
    source: "github",
    author: "Rohan S",
    updatedAt: "4 days ago",
    ingestionStatus: "indexing",
    vectorChunksCount: 16,
    fileSize: "18.4 KB",
    tags: ["qdrant", "vector-search", "ai", "rag"],
    linkedServices: ["recommendation-engine"],
    linkedIncidents: ["INC-8488"],
    contentMarkdown: `
# Qdrant HNSW Index Optimization Guide

## Parameter Baseline
- \`M\`: 32 (controls number of bidirectional links per vector node)
- \`ef_construct\`: 128 (construction search depth)
`,
    vectorChunks: [],
  },
];
