## Phase 2 Plan – AquaBuilder

Goals (2–3 weeks):
- Round out MVP: substrate/extras flows, equipment guidance, polished summary and sharing.
- Add admin pricing, basic auth, telemetry, and resilient state. Expand tests.

Milestones
- M1 Wizard & Browse Enhancements (Week 1)
  - Wizard Agent: Show Compatibility Score; add Equipment Hints (GPH/W·gal, coverage) panel; final step with Share (copy link).
  - Browse Agent: Add Substrate + Extras tabs; add filter chips (min tank, intensity, wattage) and simple pagination.
  - UI Agent: Soft UI refinements (rounded-2xl, gradient headers, glass cards) and helper components (Tabs, Chip, Toast).
  - QA/Test Agent: Expand unit tests for core rules; smoke tests for tabs switching and warnings updates.

- M2 Persistence, Admin, and Summary (Week 2)
  - Wizard Agent: LocalStorage persistence + hydration on load.
  - Pricing/Admin Agent: /admin/prices page (list, inline edit, save); zod validation; fallback-friendly.
  - Web Agent: Tighten route handler validation and error envelopes.
  - Summary Owner (Web/UI/Core): Polished Build Summary (Soft UI), include Score, CompatibilityPanel, and Price Sparkline from selected filter.
  - QA/Test Agent: Add route handler tests for admin prices; add summary render snapshot.

- M3 Auth, Community, Telemetry (Week 3)
  - Auth Agent: NextAuth scaffolding (email link dev stub); guard admin routes.
  - Community Agent (Web): Community page lists recent public builds; link to detail.
  - Analytics Agent: PostHog client/server hooks; basic events (build_saved, fish_added, equipment_selected).
  - QA/Test Agent: Add e2e smoke for save -> permalink -> summary.

Acceptance Criteria
- Wizard shows live score; equipment hints and warnings are consistent with rules.
- Browse includes substrate/extras; filter chips and pagination function.
- Saving a build persists and summary shows parts, score, and price sparkline (if data exists).
- Admin price edits update ProductPrice, with validated inputs.
- Local state persists across reload; auth required for admin.
- CI green: unit + QA agent + build.

Agent Assignments & Deliverables
- Wizard Agent
  - Score banner (uses @aquabuilder/core compatibilityScore).
  - Equipment Hints sidebar (recommendFilterGph/recommendHeaterWattage; coverage guidance).
  - Step 5 (Review & Share) with copy-to-clipboard and link.

- Browse Agent
  - Tabs: Substrate, Extras; filter chips and pagination.
  - Cards: richer attributes per category with Soft UI style.

- UI Agent
  - Components: Tabs, Chip (filter), Toast, ScoreBadge.
  - Theme tweaks: gradients, shadows, spacing utilities.

- Pricing/Admin Agent
  - Page: /admin/prices with list/edit/save.
  - API: zod-validated routes for price upsert.

- Web Agent
  - Route schemas; consistent error structure; shared zod types.

- Core Agent
  - Expose helper recs (GPH/W·gal) with explanations.
  - Add score helpers (beginner score) and export types.

- Auth Agent
  - NextAuth routes (stub email provider); session guard for /admin.

- Analytics Agent
  - PostHog client hook and server middleware for core events.

- QA/Test Agent
  - Extend tools/qa to cover: score calculation display, tab rendering, admin price save, summary render.

Execution Order
1) UI primitives (Tabs/Chip/Toast) → 2) Browse tabs/filters → 3) Wizard score/hints → 4) LocalStorage persistence → 5) Summary polish → 6) Admin pricing → 7) Auth guard → 8) Telemetry → 9) QA coverage.

Risk/Mitigation
- No DB in dev: maintain fallback paths; admin editing operates on fallback if DB missing.
- Next version drift: pin versions in package.json and run build in QA agent.
- Styling regression: keep changes confined to @aquabuilder/ui and local classes.

Runbook for Agents
- Before merge: run `pnpm --filter ./apps/web build` and `pnpm qa`.
- Update docs/UPDATE_LOG.md with each delivery; keep docs/TODO.md in sync.

