# Architecture

- Monorepo via pnpm workspaces.
- apps/web: UI + API routes (Next.js App Router).
- packages/db: Prisma schema, client, seeds.
- packages/core: Domain logic (compatibility, sizing, bioload, scores).
- packages/ui: Shared UI components.
- services/scraper: BullMQ workers for price tracking (TBD).
- infra: Docker compose for Postgres and Redis.

