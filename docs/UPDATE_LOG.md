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
