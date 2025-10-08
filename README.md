## AquaBuilder Monorepo

Developer setup:

- Requirements: Node 20+, Corepack, pnpm 9, Docker (optional for local Postgres/Redis).
- Install deps: `corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm i`
- Env: copy `.env.example` to `.env` and set at least `NEXTAUTH_SECRET`. For DB-backed dev, set `DATABASE_URL`. For Amazon PA-API, set `AMAZON_*`.
- (Optional) Start services: `docker compose -f infra/docker-compose.yml up -d`.
- Prisma: `pnpm -F @aquabuilder/db prisma migrate dev --name init && pnpm -F @aquabuilder/db prisma db seed`.
- Dev: `pnpm dev` (Next.js on http://localhost:3000).

Packages:

- apps/web – Next.js app (App Router).
- packages/db – Prisma schema + client + seeds.
- packages/core – Domain logic utilities.
- packages/ui – Shared UI components.
- services/scraper – Price tracker workers (scaffold next).
- infra – Docker compose for Postgres/Redis.

Quick start (no DB required):

- Copy env: `cp .env.example .env` (leave `DATABASE_URL` unset to use in-memory fallbacks in dev).
- Run dev: `pnpm dev` then open http://localhost:3000.
- Admin (dev): visit `/signin` and use `admin@example.com` with passcode `admin` (configurable via `ADMIN_EMAIL`/`ADMIN_PASSCODE`).
- Notes: Amazon actions work with friendly fallbacks unless `AMAZON_*` is configured; analytics log to console in dev.
