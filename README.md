# Aegis — AI Engineering Reliability & Operations Platform

Aegis is an AI-powered engineering reliability and operations platform designed to connect code, deployments, telemetry, incidents, and engineering knowledge.

## Monorepo Architecture

- `apps/web`: Next.js 14+ frontend application (TypeScript, Tailwind CSS)
- `apps/api`: Express.js backend application (Phase 2+)
- `packages/`: Shared packages (`types`, `config`, `validation`)
- `docs/`: Architecture decisions, API definitions, and operational guides
- `infrastructure/`: Docker Compose and deployment manifests

## Getting Started (Day 1 — Web Application)

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Run Frontend Locally

```bash
cd apps/web
npm install
npm run dev
```

The web dashboard will be available at `http://localhost:3000`.
