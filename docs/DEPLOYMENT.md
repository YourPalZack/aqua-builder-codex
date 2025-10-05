## Deployment

- Web (apps/web): Vercel.
- DB: Neon or Supabase (Postgres).
- Redis: Upstash.
- Workers (services/scraper): Fly.io or Render.

Steps:
1. Set DATABASE_URL and NEXTAUTH_SECRET in Vercel.
2. Run `pnpm -F @aquabuilder/db prisma migrate deploy` against production DB.
3. Deploy Next.js app.
4. Deploy worker with REDIS_URL, DATABASE_URL, and email API key.

Environment variables for Amazon affiliate integration:
- AMAZON_ACCESS_KEY: Amazon Product Advertising API access key
- AMAZON_SECRET_KEY: Amazon Product Advertising API secret key
- AMAZON_PARTNER_TAG: Your Associates tag (e.g., aquabuilder-20)
- AMAZON_REGION: PA-API region (default us-east-1)
- AMAZON_HOST: PA-API host (default webservices.amazon.com)

Notes:
- The scraper auto-detects `retailer: 'Amazon'` jobs, extracts the ASIN from the job URL, fetches price via PA-API, and stores affiliate-tagged URLs in ProductPrice.
- When env is missing, price fetch falls back to synthetic test prices to keep flows working.
