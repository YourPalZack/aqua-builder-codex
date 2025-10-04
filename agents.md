# AquaBuilder Sub‑Agents

This file lists specialized sub‑agents, their scope, inputs/outputs, and hand‑offs. Use this as a playbook to orchestrate multi‑step work.

## Core Delivery Agents

- Repo Agent
  - Purpose: Monorepo bootstrapping, workspace config, Turbo, scripts.
  - Inputs: Roadmap tasks; required packages/configs.
  - Outputs: package.json, pnpm-workspace.yaml, turbo.json, scripts.
  - Handoffs: Web/DB/Core/UI agents.

- Web Agent
  - Purpose: Next.js app features (App Router), pages, API handlers.
  - Inputs: UI specs, API shapes, domain functions.
  - Outputs: `apps/web/src/app/**`, route handlers, page/layout components.
  - Handoffs: UI Agent (components), Core Agent (logic), DB Agent (prisma client).

- DB Agent
  - Purpose: Prisma schema, migrations, seeds, client exports, fallbacks.
  - Inputs: ERD, models, seed lists.
  - Outputs: `packages/db/prisma/**`, `packages/db/src/**`.
  - Handoffs: Web Agent (APIs), Scraper Agent (writes), Admin Agent (prices).

- Core Agent
  - Purpose: Domain algorithms (bioload, equipment sizing, compatibility, scores).
  - Inputs: Rules/thresholds, data shapes.
  - Outputs: `packages/core/src/**` reusable functions.
  - Handoffs: Web Agent (wizard), QA Agent (tests).

- UI Agent
  - Purpose: Shared UI components styled per Soft UI guideline.
  - Inputs: Design tokens/specs.
  - Outputs: `packages/ui/src/**` (Button, Card, Inputs, Panels, charts placeholders).
  - Handoffs: Web Agent.

## Feature‑Specific Agents

- Wizard Agent
  - Purpose: Build flow (steps, Zustand store wiring, live warnings, Tank Picker).
  - Inputs: Core algorithms, parts data.
  - Outputs: `apps/web/src/app/build/**`.
  - Handoffs: Web Agent (routing), Core Agent.

- Browse Agent
  - Purpose: Part selector with tabs, search, selection, quantity controls.
  - Inputs: API endpoints, UI kit.
  - Outputs: `apps/web/src/app/browse/**`.
  - Handoffs: Wizard Agent (state), Pricing/Admin Agent (edit hooks).

- Pricing/Admin Agent
  - Purpose: Admin price entry UI, ProductPrice CRUD, inline edits.
  - Inputs: Prisma client, validation.
  - Outputs: `/admin/prices` pages, API routes.
  - Handoffs: Scraper Agent (price trends), Web Agent.

- Scraper Agent
  - Purpose: BullMQ workers, retailer adapters, alert checks.
  - Inputs: REDIS_URL, DATABASE_URL, adapters.
  - Outputs: `services/scraper/src/**`, queues, cron.
  - Handoffs: DB Agent (writes), Alerts Agent (emails).

- Alerts Agent
  - Purpose: Price alerts evaluation and notifications (Resend/SendGrid).
  - Inputs: PriceAlert table, latest prices.
  - Outputs: Email sends, status updates.
  - Handoffs: Web Agent (manage alerts UI/API).

- Auth Agent
  - Purpose: NextAuth setup (email OAuth), session‑guarded routes.
  - Inputs: Provider keys, session rules.
  - Outputs: Auth config, sign‑in/out UI.
  - Handoffs: Admin/Community/Web agents.

- Analytics Agent
  - Purpose: PostHog wiring (events, feature flags), basic server logs.
  - Inputs: POSTHOG_KEY.
  - Outputs: Client/server hooks, flag checks.
  - Handoffs: All feature agents for instrumentation.

- QA/Test Agent
  - Purpose: Vitest unit, Playwright e2e setup, CI steps.
  - Inputs: Scenarios, acceptance criteria.
  - Outputs: `tests/**`, CI workflow updates.
  - Handoffs: All agents for coverage.

- Infra/CI Agent
  - Purpose: Docker compose (Postgres/Redis), GitHub Actions, env templates.
  - Inputs: Service requirements.
  - Outputs: `infra/docker-compose.yml`, `.github/workflows/**`, `.env.example`.
  - Handoffs: Scraper/Web/DB agents.

- Docs Agent
  - Purpose: Repository docs (README, API, Architecture, TODO, Update Log).
  - Inputs: System architecture and changes.
  - Outputs: `/docs/**`, `agents.md`.
  - Handoffs: Stakeholders, new contributors.

## Orchestration Guidelines

- Triggering
  - Create a plan in docs/TODO.md; keep UPDATE_LOG.md current per change.
  - Spin up specific agents only for their domain to reduce churn.

- Handoffs
  - Provide minimal, typed interfaces (TS types, zod schemas) across agents.
  - Prefer packages (`@aquabuilder/*`) for stable boundaries.

- Quality Gates
  - Web builds green; no TS errors. Core functions covered by unit tests.
  - API handlers validated with zod and return typed responses.

- Styling Baseline
  - Follow Soft UI Dashboard Tailwind: rounded‑2xl, subtle shadows, gradients, glass effects.

- Runbook
  - Dev: `pnpm dev` (Next) and optional Redis/Postgres.
  - Build: `pnpm build`. CI runs migrate deploy (if DB provided) + tests.

## Current Agent Assignments

- Repo/Web/DB/Core/UI/Wizard/Browse/Docs agents are active and delivered MVP features.
- Upcoming: Pricing/Admin, Auth, Analytics, QA/Test, Alerts, Infra/CI expansions.

