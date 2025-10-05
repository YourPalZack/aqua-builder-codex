## Major Functions To Complete AquaBuilder

This catalog enumerates the core functions and utilities that must exist (or be expanded) to complete the app. Functions are grouped by module with short descriptions and expected inputs/outputs.

### packages/core (Domain Logic)
- Compatibility
  - `computeFilterTurnoverStatus({ gph, tankGal }): { level, code, message } | null`
  - `computeHeaterStatus({ wattage, tankGal }): { level, code, message } | null`
  - `computeLightCoverageStatus({ coverageCm, tankLengthCm }): { level, code, message } | null`
  - `computeWaterTypeConflicts({ buildType, species[] }): issues[]` (fresh vs salt, reef flags)
  - `computePredationConflicts({ fish[], inverts[] }): issues[]` (predator/prey rules)
  - `computeAggressionTerritoryRules({ fish[], tankGal }): issues[]` (territory, aggression)
  - `computeSchoolingWarnings({ fishSelections[] }): issues[]`
  - `checkFishParams(fishList): { temp, ph, ok }` (already present; consider variants per build type)
  - `calcBioloadPct(...)` (present)
  - `compatibilityScore(warnings)` and `beginnerFriendlyScore(warnings, opts)` (present)

- Recommendations
  - `recommendFilterGph(tankGal)` (present)
  - `recommendHeaterWattage(tankGal)` (present)
  - `recommendLightCoverage({ tankLengthCm, buildType }): { coverageMinCm }`
  - `recommendSubstrate({ buildType }): SubstrateType[]`

- Costs & Estimates
  - `computeInitialCost({ components, priceLookup }): number`
  - `computeMonthlyCost({ tankGal, equipment, stocking }): number` (energy + consumables heuristic)

### packages/db (Data Helpers)
- `getPrismaSafe()` (present; returns prisma + fallback)
- Repos (thin helpers wrapping Prisma for clarity; optional):
  - `listParts({ category, filters, page, pageSize })`
  - `saveBuild({ name, buildType, components })`
  - `getBuild(id)`
  - `upsertPrice({ productType, productId, retailer, priceCents, ... })`

### apps/web (API & UI Utilities)
- Validation
  - Shared zod schemas (present for builds/prices); add schemas for routes: alerts, search, pagination params.
  - Error envelope helpers: `jsonError(message, issues?)` to standardize responses.

- UI Hooks/Utils
  - `useDebouncedValue(value, delay)` for search inputs.
  - `useServerAction(action)` wrapper (if we adopt server actions for writes).
  - Table helpers for Admin prices.

### services/scraper (Workers)
- Queue & Jobs
  - `schedulePriceFetch({ productType, productId, retailer, url })`
  - `fetchHtml(url)` and per‑retailer `parse(html): { priceCents, inStock }`
  - `writePricePoint({ productType, productId, retailer, priceCents, inStock, url })`
  - `pruneOldPrices({ days })`
  - `checkAlerts()` and `sendEmail({ to, subject, html })`

### Auth & Guarding
- `getServerSession()` wrapper; `requireAdmin()` guard for admin routes.
- Middleware for /admin to check session (dev stub until providers are wired).

### Sharing & Community
- `serializeBuildState(components)` and `deserializeBuildState(json)` for portable links.
- OG image generator route for `/b/{slug}` share cards.
- Community listing: `listPublicBuilds({ page, filters })`.

