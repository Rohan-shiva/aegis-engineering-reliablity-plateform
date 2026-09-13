# PostgreSQL Database Schema & Prisma ORM Architecture

This document details the relational PostgreSQL database design, Prisma ORM schema configuration, seeder strategy, and database client fallback lifecycle for the **Aegis** platform (`apps/api/prisma`).

---

## 1. Relational Entity Relationship Model

```
┌──────────────────┐          1:N          ┌───────────────────────────┐
│     services     │ ────────────────────> │     service_endpoints     │
│ (id, name, status)│                       └───────────────────────────┘
└────────┬─────────┘
         │
         │ 1:N                             ┌───────────────────────────┐
         ├───────────────────────────────> │    service_dependencies   │
         │                                 └───────────────────────────┘
         │
         │ 1:N                             ┌───────────────────────────┐
         └───────────────────────────────> │        deployments        │
                                           └─────────────┬─────────────┘
                                                         │ 1:N
                                                         ▼
                                           ┌───────────────────────────┐
                                           │  deployment_changed_files │
                                           └───────────────────────────┘

┌──────────────────┐          1:N          ┌───────────────────────────┐
│    incidents     │ ────────────────────> │    incident_timelines     │
│ (code, severity) │                       └───────────────────────────┘
└──────────────────┘

┌───────────────────────────┐              ┌───────────────────────────┐
│    knowledge_documents    │              │     ai_investigations     │
│ (type, ingestion_status)  │              │ (confidence, planner_json)│
└───────────────────────────┘              └───────────────────────────┘
```

---

## 2. PostgreSQL Schema Tables & Primary Keys

| Table Name | Model | Primary Key | Key Relations & Indexes |
| :--- | :--- | :--- | :--- |
| `services` | `Service` | `id` (UUID) | Unique index on `name` |
| `service_endpoints` | `ServiceEndpoint` | `id` (UUID) | Cascade onDelete FK to `services.id` |
| `service_dependencies` | `ServiceDependency` | `id` (UUID) | Cascade onDelete FKs to `services.id` |
| `incidents` | `Incident` | `id` (UUID) | Unique index on `code` (e.g. `INC-8492`) |
| `incident_timelines` | `IncidentTimeline` | `id` (UUID) | Cascade onDelete FK to `incidents.id` |
| `deployments` | `Deployment` | `id` (UUID) | Unique index on `commitSha`, FK to `services.id` |
| `deployment_changed_files` | `DeploymentChangedFile` | `id` (UUID) | Cascade onDelete FK to `deployments.id` |
| `knowledge_documents` | `KnowledgeDocument` | `id` (UUID) | Typed `DocumentType` & `IngestionStatus` |
| `ai_investigations` | `AIInvestigation` | `id` (UUID) | JSON columns for `hypothesesJson`, `toolCallsJson` |

---

## 3. Database Seeding & Fallback Lifecycle

```typescript
// DatabaseClient (src/db/client.ts) singleton pattern
if (process.env.DATABASE_URL) {
  // Query live PostgreSQL cluster via Prisma ORM
} else {
  // Graceful fallback to isolated in-memory domain repositories
}
```

To seed live database instance:
```bash
npm run db:seed
```
