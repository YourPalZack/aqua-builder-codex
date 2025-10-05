# Update Log

- Init: Monorepo scaffold, Next app, Prisma schema, core utils, UI kit, API routes, infra, and CI.
- Fallback seed data: Added rich local fixtures and safe Prisma fallback for offline testing.
- Browse: Added Fish/Plants/Filters/Heaters/Lights tabs with soft UI cards, search, and quantity/selection.
- Wizard: Added tank input, live bioload/schooling/param warnings, and CompatibilityPanel.
- Current Build: Sidebar with Save & Share action; POST /api/builds and redirect.
- Scraper: Disabled in dev without REDIS_URL; queue names fixed.
- Turbo: Updated pipeline->tasks for v2.
- Robust fetch handling: All client fetches use safe text->JSON parsing with loading/empty/error states to prevent runtime JSON errors.
- Phase 2 Plan: Added docs/PHASE_2_PLAN.md with milestones, agent assignments, acceptance criteria, and execution order. Updated docs/TODO.md with agent-tagged tasks.

Planned next:
- Tank picker; equipment warnings; Build Summary page; score and sparkline.
- M1 start: Added UI primitives (Chip, Toast, ScoreBadge), wizard score and equipment guidance card, and Browse fish/filters filter chips with basic pagination. Updated layout to include Toast container.
- Added core checks (water type, predation, aggression, schooling), recommendations (light coverage/substrate), and costs. Wired into Wizard and Summary. Parts API now supports pagination and basic filters; Community page lists public builds via new API. QA agent updated to cover builds list. Initial and monthly cost estimates appear in Wizard and Summary.
 - Added server-side initial cost route at `apps/web/src/app/api/costs/initial/route.ts` with zod validation; Wizard can adopt this to reduce client fetches.
 - Replaced OG placeholder with SVG generator at `apps/web/src/app/api/og/route.ts` supporting `title`/`subtitle` params for share cards.
 - Extended shared schemas with `InitialCostSchema` and `PaginationQuerySchema`.
 - QA Agent: added tests for initial cost route and OG image endpoint; all checks green via `pnpm qa`.
 - Auth: Added dev auth stub and `requireAdmin`; `/api/admin/prices` now guarded (dev allows).
 - API Validation: Parts endpoint now validates query params with zod and returns standardized error envelopes.
 - Analytics: Added minimal `logEvent` util and server-side `build_saved` event on build creation.
 - Added `/api/analytics` endpoint + client sender (beacon/fetch) and QA test.
 - Alerts + Builds List: moved/added zod schemas to shared; routes now validate and return consistent error envelopes.
- Dev Auth: Added `/api/auth/login` and `/api/auth/logout` to toggle `admin` cookie for quick testing.
 - Session: Added `/api/auth/session`; middleware now uses session-driven guard. Header chip shows Admin status.
- Browse: Unified pagination UI and applied server search/pagination across all lists.
 - Parts API: Added `lightNeeds`/`difficulty`/`co2` filters for `plants` and `category` filter for `equipment`; fixed query parsing for `q`/`count`. When `count` is present, responses include `{ items, total }`.
- Browse UI: Plants now drives server-side `lightNeeds`; Extras exposes category chips and uses unified Pagination.
 - Scraper: Added Amazon PA-API integration with SigV4 signing; Amazon jobs fetch price by ASIN and store affiliate-tagged URLs. Fallback to synthetic prices when env not configured.
- Web API: Added `/api/amazon/popular` to return affiliate-tagged popular items per equipment category via Amazon PA-API SearchItems.
- Admin: Prices page defaults retailer to Amazon and accepts optional Product URL; server auto-appends affiliate tag for Amazon URLs.
 - Community: `/api/builds/list` now supports pagination and optional `count`; Community page uses server pagination and renders controls.
 - Plants Browse: Added server-driven filters for `difficulty` and `CO2` chips; UI wired to backend.
 - Analytics: Amazon buy links send `amazon_buy_click` to `/api/analytics` with product info.
