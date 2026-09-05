# Aegis Architecture — Frontend Foundation (Day 1)

## Overview

The Aegis user interface is built as a high-density operational platform tailored for software engineering, site reliability, and DevOps teams.

It uses Next.js 14+ (App Router), TypeScript, and Tailwind CSS. The design system follows a modern dark engineering theme inspired by production observability and incident response tools (Datadog, Linear, PagerDuty).

## Project Structure (`apps/web`)

```
apps/web/
├── src/
│   ├── app/
│   │   ├── globals.css         # Custom dark theme variables & utility scrollbars
│   │   ├── layout.tsx          # Root HTML layout & font declarations
│   │   └── page.tsx            # Overview Reliability Dashboard
│   ├── components/
│   │   ├── ui/
│   │   │   ├── StatusBadge.tsx # System & microservice health indicators
│   │   │   ├── SeverityBadge.tsx # Incident severity indicators (SEV-1 .. SEV-4)
│   │   │   ├── Card.tsx        # Base dark surface containers & header layouts
│   │   │   ├── MetricCard.tsx  # High-density operational metric displays
│   │   │   └── Button.tsx      # Standardized engineering UI buttons
│   │   └── layout/
│   │       ├── TopNav.tsx      # Platform brand header, org switcher, global search
│   │       ├── Sidebar.tsx     # Operations, RAG, and System navigation links
│   │       └── AppShell.tsx    # Responsive application container shell
│   └── lib/
│       └── utils.ts            # Class merging utilities (`clsx` + `tailwind-merge`)
├── tailwind.config.ts          # Custom Aegis color system (surfaces, SEV levels, status dots)
├── tsconfig.json               # TypeScript strict configuration & alias `@/*`
└── package.json
```

## Key Technical Decisions (ADR)

1. **Modular Monorepo First**: Monorepo workspace allows clean boundary separation between the frontend web app (`apps/web`), future backend service (`apps/api`), and shared packages (`packages/types`).
2. **App Router Layout Isolation**: Application shell (`AppShell`, `TopNav`, `Sidebar`) handles layout state independently from page view controllers, allowing seamless client navigation.
3. **Information Density Design**: Prioritizes status badges, severity markers, commit shas, p99 latency stats, and AI diagnostic widgets without clutter.
