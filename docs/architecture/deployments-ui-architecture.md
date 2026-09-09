# Aegis Architecture — Deployments UI & Risk Scoring (Day 5)

## Overview

Day 5 introduces the Deployments Module, establishing the Deployment Stream Catalog (`/deployments`) and Deployment Risk Analysis Views (`/deployments/[deploymentId]`) for pre-deployment change auditing, weighted risk scoring, diff inspection, and dependency blast radius estimation.

---

## Routing & Layout Architecture

```
apps/web/src/app/deployments/
├── page.tsx                           # Deployment Stream Catalog Route (/deployments)
└── [deploymentId]/
    └── page.tsx                       # Deployment Risk Detail Route (/deployments/[deploymentId])
```

- **`page.tsx` (`/deployments`)**: Searchable deployment risk stream supporting **Risk Level Filters** (`HIGH`, `MEDIUM`, `LOW`), **Environment Filters** (`PROD`, `STAGING`, `DEV`), and **View Mode Toggles** (`Grid` vs `Table`).
- **`[deploymentId]/page.tsx` (`/deployments/[deploymentId]`)**: Comprehensive change risk audit view featuring deterministic risk score gauges (`0-100`), signal rationale breakdowns, file diff listings, and blast radius impact maps.

---

## Deterministic Risk Scoring Model

Aegis calculates deployment risk scores deterministically before introducing LLM explanations in later phases.

$$\text{RiskScore} = \min\left(100, \sum_{i} W_i \right)$$

Where $W_i$ represents weighted signal multipliers:

| Signal Category | Trigger Condition | Weight ($W_i$) |
| :--- | :--- | :--- |
| **Core Payment Path** | Modifications to payment processing or checkout ledger code | +30 pts |
| **Database Schema Change** | SQL migration script, schema alteration, or index change | +25 pts |
| **Historical Incident Match**| Change pattern correlates with past SEV-1/SEV-2 incident | +15 pts |
| **Downstream Cascade** | Target microservice has $>1$ downstream dependent nodes | +12 pts |
| **Test Coverage Gap** | Unit/integration test coverage $< 80\%$ on modified lines | +10 pts |

---

## Component Taxonomy (`apps/web/src/components/deployments/`)

- **`DeploymentCatalogHeader`**: Search bar, risk level filter pills (`HIGH (71-100)`, `MEDIUM (31-70)`, `LOW (0-30)`), environment filter, and view mode toggle buttons.
- **`DeploymentCard`**: Visual card displaying risk score pills, commit messages, author metadata, and risk factor highlights.
- **`DeploymentTable`**: Tabular list for high-density release auditing.
- **`DeploymentRiskSignals`**: Categorized weighted score breakdown showing exactly why a release received its risk rating.
- **`DeploymentChangedFiles`**: Auditable changed files list displaying additions (+), deletions (-), and critical path flags.
- **`DeploymentBlastRadius`**: Target service node and downstream microservice impact analysis.
