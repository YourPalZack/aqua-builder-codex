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

