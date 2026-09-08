# Aegis Architecture — Incidents UI & Incident Room (Day 4)

## Overview

Day 4 introduces the Incidents Module, establishing the Incident Catalog (`/incidents`) and real-time Incident Command Rooms (`/incidents/[incidentId]`) for automated anomaly triage, evidence correlation, and timeline audit logging.

---

## Routing & Layout Architecture

```
apps/web/src/app/incidents/
├── page.tsx                           # Incident Catalog Route (/incidents)
└── [incidentId]/
    └── page.tsx                       # Incident Detail Room Route (/incidents/[incidentId])
```

- **`page.tsx` (`/incidents`)**: Searchable incident triage catalog supporting **Severity Filters** (`SEV-1` through `SEV-4`), **Status Filters** (`Active`, `Investigating`, `Mitigated`, `Resolved`), and **View Mode Toggles** (`Grid` vs `Table`).
- **`[incidentId]/page.tsx` (`/incidents/[incidentId]`)**: Real-time incident room featuring an interactive status state machine (`Acknowledge`, `Mitigate`, `Resolve`), timeline stream, AI evidence correlation, and responder metadata.

---

## Incident Lifecycle State Machine

```
   [ Detection Alert ]
           │
           ▼
        ACTIVE ──( Acknowledge )──► INVESTIGATING
           │                            │
           │                            │
       ( Mitigate )                  ( Mitigate )
           │                            │
           ▼                            ▼
       MITIGATED ──────( Resolve )───► RESOLVED
                                          │
                                          ▼
                                   [ Postmortem Generation ]
```

---

## Component Taxonomy (`apps/web/src/components/incidents/`)

- **`IncidentCatalogHeader`**: Search bar, severity filter pills (`SEV-1`..`SEV-4`), status dropdown, and "Declare Incident" button.
- **`IncidentCard`**: Visual card displaying severity badges, status tags, affected service badges, and AI hypothesis confidence ratings.
- **`IncidentTable`**: Tabular list for high-density operational triage.
- **`IncidentTimelineStream`**: Chronological event audit trail rendering detection alerts, automated AI findings, commander updates, and resolution events with author badges.
- **`IncidentAISidebar`**: AI Investigator widget displaying hypothesis ratings, correlated evidence logs/metrics, and recommended mitigation steps.
- **`IncidentMetaSidebar`**: Responder commander card, affected services list, telemetry alert snapshots, Slack channel links, and emergency runbook shortcuts.
