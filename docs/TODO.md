# TODO Roadmap

Planned next features (10–20 items):

Phase 2 (see docs/PHASE_2_PLAN.md for detail):
1. [Core Agent] Expand compatibility: water type, predation, aggression/territory, schooling edge cases.
2. [Core Agent] Recommendations: light coverage and substrate by build type.
3. [Core Agent] Cost engine: initial + monthly estimates. (initial cost route live)
4. [Web Agent] Shared zod types + standardized error envelopes across all routes. (parts/params validated)
5. [UI Agent] DataTable for admin; debounce/loader hooks; polish chips & panels. (Plants lightNeeds + Extras category chips wired)
6. [Wizard Agent] Review & Share polish; show cost estimates alongside score.
7. [Summary Owner] Beginner score parity and warnings render (done); add cost/sparkline blocks.
8. [Pricing/Admin Agent] Price table (done) + inline edit UX.
9. [Auth Agent] NextAuth stub + requireAdmin guard for /admin. (requireAdmin stub done; NextAuth pending)
10. [Scraper Agent] Scaffolds for schedule/fetch/parse/write/prune/checkAlerts; wire later with Redis. (Amazon PA-API integrated; pricing writes affiliate-tagged URLs)
11. [Sharing Agent] OG image route and build state serializer/deserializer. (OG route done)
12. [Community Agent] Public builds list with filters. (consider adding count/pagination next)

Recent:
- [Web Agent] Parts API: added plants `lightNeeds`/`difficulty`/`co2` and equipment `category` server filters; fixed `q`/`count` parsing bug; consistent `{ items, total }` when `count` requested.
- [UI Agent] Plants uses server-side `lightNeeds`; Extras adds category chips and unified Pagination.
- [Scraper/Web Agent] Amazon PA-API: added SearchItems & GetItems clients, `/api/amazon/popular` route, admin Amazon URL handling with affiliate tag.
13. [QA/Test Agent] Extend coverage to new routes and cost/score sanity checks. (initial cost route + OG covered)
14. [Infra/CI Agent] Add core unit tests and QA runner step in CI.
A
