# Aegis Architecture — Services UI & Dependency Graph (Day 3)

## Overview

Day 3 introduces the Services Module, establishing the Service Catalog (`/services`) and Service Detail (`/services/[serviceId]`) views for microservice discovery, health analysis, dependency topology mapping, and deployment audit tracking.

---

## Routing & Layout Architecture

```
apps/web/src/app/services/
├── page.tsx                           # Service Catalog Route (/services)
└── [serviceId]/
    └── page.tsx                       # Service Detail Route (/services/[serviceId])
```

- **`page.tsx` (`/services`)**: Provides a searchable, filterable catalog supporting both **Grid View** (card layout) and **Table View** (high-density list).
- **`[serviceId]/page.tsx` (`/services/[serviceId]`)**: Dynamic detail page with tabbed sub-navigation (`Overview`, `Dependencies`, `History`).

---

## Component Taxonomy (`apps/web/src/components/services/`)

- **`ServiceCatalogHeader`**: Search bar, environment selector (`All`, `Production`, `Staging`), team dropdown, and view mode toggle buttons.
- **`ServiceCard`**: Visual card displaying p99 latency, SLA target percentage, error rate, framework badges, and active alert counters.
- **`ServiceTable`**: Dense tabular view for quick scanning across dozens of microservice nodes.
- **`ServiceOverviewTab`**: SLA metrics, endpoint health table (`GET /health`, `POST /checkout`), and runtime environment specifications.
- **`ServiceDependenciesTab`**: Visual upstream callers and downstream service dependency tree displaying latency and health status per node.
- **`ServiceHistoryTab`**: Filtered deployment stream and linked production incident reports.
