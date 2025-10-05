# API

See `apps/web/openapi.yaml` for the OpenAPI spec.

Key routes:
- GET `/api/parts/{category}`
- POST `/api/builds`
- GET `/api/builds/{id}`
- GET `/api/prices/{productType}/{productId}`
- POST `/api/alerts`
- GET `/api/amazon/popular?category={filters|heaters|lights|substrate|equipment}&limit=6`
  - Returns top search results from Amazon PA-API for the given category.
  - Each item: `{ asin, title, priceCents, url, image }` with `url` affiliate-tagged using `AMAZON_PARTNER_TAG`.
 - POST `/api/admin/amazon/fetch`
   - Body: `{ productType, productId, url?, asin? }`
   - Requires admin (dev allowed). Extracts ASIN and fetches price via PA-API; writes `ProductPrice` row with affiliate-tagged URL.
