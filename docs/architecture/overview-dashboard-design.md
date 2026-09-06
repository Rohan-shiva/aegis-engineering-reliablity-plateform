# Aegis Architecture — Overview Dashboard & Data Model (Day 2)

## Overview

Day 2 introduces domain models, isolated mock fixtures, and interactive dashboard components for service monitoring, incident triage, and deployment risk streaming.

## Domain Model Specifications (`apps/web/src/types/domain.ts`)

### 1. `ServiceHealth`
Tracks microservices, environments (`production`, `staging`), p95/p99 latency, error rates, throughput (RPS), owner team, and active incident counts.

### 2. `Incident`
Represents production operational anomalies. Includes severity level (`SEV-1` through `SEV-4`), affected service references, automated AI root-cause hypotheses with confidence ratings, assigned commanders, and chronological event timelines.

### 3. `Deployment`
Captures code deployment events linked to commit SHAs, commit messages, author metadata, and calculated deterministic risk scores (`0-100`) with risk factor rationale.

### 4. `TelemetryDatapoint`
Time-series metrics (`errorRate`, `p99LatencyMs`, `requestVolume`) used by sparklines and anomaly detectors.

---

## Mock Fixture Isolation Layer (`apps/web/src/mocks/`)

All mock data is strictly isolated in `apps/web/src/mocks/` to adhere to Rule #9 ("Never Fake Functionality"). When backend APIs (`apps/api`) are implemented in Phase 2, mock files can be seamlessly replaced by API fetchers without modifying component interfaces.

```
apps/web/src/mocks/
├── services.ts     # 6 registered microservices (auth, payment, order, notification, db, recommendation)
├── incidents.ts    # SEV-1 and SEV-3 active production incidents with AI hypotheses
├── deployments.ts  # Deterministic deployment risk records
├── telemetry.ts    # 24h telemetry metric series & summary stats
└── index.ts        # Module re-export barrel
```

---

## Interactive Components (`apps/web/src/components/dashboard/`)

- **`ServiceHealthGrid`**: Status tabs (`All`, `Healthy`, `Degraded`, `Critical`) with quick name/team search.
- **`ActiveIncidentsPanel`**: Incident list displaying severity badges and slide-over investigation drawer.
- **`DeploymentActivityFeed`**: Risk score pills with expandable signal rationale lists.
- **`TelemetrySparkline`**: Lightweight SVG time-series visualizer.
