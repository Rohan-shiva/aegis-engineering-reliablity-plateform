# Backend Express API Architecture & REST Specification

This document details the backend microservice architecture for the **Aegis** platform (`apps/api`), including endpoint contracts, response envelope specifications, middleware execution pipeline, and shared workspace package integration.

---

## 1. Overview & Monorepo Topology

Aegis backend is structured as an Express.js TypeScript application located in `apps/api`, consuming canonical domain models from the `@aegis/types` workspace package (`packages/types`).

```
apps/api/
├── src/
│   ├── config/
│   │   └── env.ts                 # Environment variables & runtime port configuration
│   ├── errors/
│   │   └── AppError.ts            # Custom HTTP error hierarchy (NotFoundError, BadRequestError)
│   ├── utils/
│   │   └── response.ts            # Standardized JSON API response envelope helpers
│   ├── middlewares/
│   │   └── errorHandler.ts        # Centralized Express error handler
│   ├── repositories/
│   │   ├── servicesRepository.ts  # In-memory service health dataset
│   │   ├── incidentsRepository.ts # In-memory incident records dataset
│   │   ├── deploymentsRepository.ts
│   │   ├── knowledgeRepository.ts
│   │   └── investigationsRepository.ts
│   ├── controllers/
│   │   ├── healthController.ts
│   │   ├── servicesController.ts
│   │   ├── incidentsController.ts
│   │   ├── deploymentsController.ts
│   │   ├── knowledgeController.ts
│   │   └── investigationsController.ts
│   ├── routes/
│   │   ├── healthRoutes.ts
│   │   ├── servicesRoutes.ts
│   │   ├── incidentsRoutes.ts
│   │   ├── deploymentsRoutes.ts
│   │   ├── knowledgeRoutes.ts
│   │   └── investigationsRoutes.ts
│   ├── app.ts                     # Express application factory & middleware chain
│   └── server.ts                  # HTTP listener entrypoint
```

---

## 2. Standardized Response Envelope Schema

All Aegis REST endpoints return JSON payload wrapped in a deterministic envelope structure:

### Success Response (`200 OK`)

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "timestamp": "2026-09-12T11:45:00.000Z"
}
```

### Error Response (`4xx / 5xx`)

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Service with ID or name 'svc-unknown' was not found"
  },
  "timestamp": "2026-09-12T11:45:00.000Z"
}
```

---

## 3. REST Endpoint Registry (`/api/v1`)

| Method | Endpoint Path | Query Filters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | None | Service liveness & uptime check |
| `GET` | `/api/v1/services` | `status`, `search` | List microservice health records |
| `GET` | `/api/v1/services/:id` | None | Get specific microservice details & dependencies |
| `GET` | `/api/v1/incidents` | `severity`, `status`, `search` | List incidents with severity filtering |
| `GET` | `/api/v1/incidents/:id` | None | Get detailed incident record & timeline |
| `GET` | `/api/v1/deployments` | `environment`, `status`, `minRiskScore` | List CI/CD deployments & risk signals |
| `GET` | `/api/v1/deployments/:id` | None | Get deployment diff & changed files |
| `GET` | `/api/v1/knowledge` | `type`, `status`, `search` | List Knowledge Base documents & vector status |
| `GET` | `/api/v1/knowledge/:id` | None | Get document content & Qdrant vector chunks |
| `GET` | `/api/v1/investigations` | `status`, `search` | List AI Agent investigations |
| `GET` | `/api/v1/investigations/:id` | None | Get AI root cause hypotheses & tool execution traces |

---

## 4. Verification & Running API Server

To start the backend API in development mode:

```bash
npm run dev:api
```

To build TypeScript source to `dist/`:

```bash
npm run build:api
```

To verify type safety across all workspace packages:

```bash
npm run type-check
```
