# Frontend API Integration & Data Fetching Architecture

This document specifies the client-side data fetching architecture, custom React hooks lifecycle, loading skeleton patterns, and automatic mock fallback strategy for the **Aegis** Next.js application (`apps/web`).

---

## 1. Overview & Data Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Web UI Pages                     │
│  /services, /incidents, /deployments, /knowledge, /invest.  │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────▼───────────────┐
               │     Custom Data Hooks         │
               │  useServices, useIncidents... │
               └───────────────┬───────────────┘
                               │
               ┌───────────────▼───────────────┐
               │    HTTP API Client Fetcher    │
               │      (api-client.ts)          │
               └───────┬───────────────┬───────┘
                       │               │
      (Backend Online) │               │ (Backend Offline / 404)
                       ▼               ▼
         ┌───────────────────┐   ┌───────────────────┐
         │ Express Backend   │   │  Local Mock Data  │
         │ http://localhost  │   │  src/mocks/*.ts   │
         │ :4000/api/v1/     │   └───────────────────┘
         └───────────────────┘
```

---

## 2. API Connection Status Indicator

The top navbar ([TopNav.tsx](file:///C:/Users/asus/.gemini/antigravity/scratch/aegis/apps/web/src/components/layout/TopNav.tsx)) dynamically renders an `ApiConnectionBadge` indicating current system telemetry state:
- **`Live API` (Emerald Badge)**: Frontend is connected to active Node.js / Express backend server at `http://localhost:4000/api/v1`.
- **`Mock Mode` (Amber Badge)**: Backend is unreachable or offline; client gracefully presents isolated mock fixtures with zero UI breakage.

---

## 3. Custom React Data Hooks Registry

| Custom Hook | Target Endpoint | Query Parameters | Fallback Fixture |
| :--- | :--- | :--- | :--- |
| `useServices(options)` | `GET /api/v1/services` | `status`, `search` | `MOCK_SERVICES` |
| `useServiceDetail(id)` | `GET /api/v1/services/:id` | `id` | `MOCK_SERVICES.find(id)` |
| `useIncidents(options)` | `GET /api/v1/incidents` | `severity`, `status`, `search` | `MOCK_INCIDENTS` |
| `useIncidentDetail(id)` | `GET /api/v1/incidents/:id` | `id` | `MOCK_INCIDENTS.find(id)` |
| `useDeployments(options)` | `GET /api/v1/deployments` | `environment`, `status`, `search` | `MOCK_DEPLOYMENTS` |
| `useDeploymentDetail(id)` | `GET /api/v1/deployments/:id` | `id` | `MOCK_DEPLOYMENTS.find(id)` |
| `useKnowledge(options)` | `GET /api/v1/knowledge` | `type`, `status`, `search` | `MOCK_KNOWLEDGE_DOCS` |
| `useDocumentDetail(id)` | `GET /api/v1/knowledge/:id` | `id` | `MOCK_KNOWLEDGE_DOCS.find(id)` |
| `useInvestigations(options)` | `GET /api/v1/investigations` | `status`, `search` | `MOCK_INVESTIGATIONS` |
| `useInvestigationDetail(id)` | `GET /api/v1/investigations/:id` | `id` | `MOCK_INVESTIGATIONS.find(id)` |
| `useDashboardMetrics()` | `GET /api/v1/health` | None | `MOCK_DASHBOARD_SUMMARY` |

---

## 4. Asynchronous Loading Skeletons

During active network request lifecycles, catalog pages render high-fidelity pulsing loading skeletons:
- `<SkeletonCard />` / `<SkeletonGrid />`: Pulsing placeholder cards matching grid layout.
- `<TableSkeleton />`: Pulsing tabular rows matching high-density data tables.
