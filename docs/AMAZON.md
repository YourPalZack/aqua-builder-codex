Amazon Product Advertising API (PA-API) Setup

Overview
- AquaBuilder integrates with Amazon PA-API to fetch prices and render affiliate links.
- You need an approved Amazon Associates account and PA-API access to obtain API keys.

Prerequisites
- Amazon account
- Amazon Associates (affiliate) account approved for the relevant marketplace (e.g., amazon.com)
- At least 3 qualified sales (per Amazon policy) to maintain PA-API access

Where to get the keys
1) Sign up for Amazon Associates
   - US: https://affiliate-program.amazon.com/
   - Configure your default store ID (this becomes your partner tag, e.g., aquabuilder-20)

2) Request PA-API access
   - Once your Associate account is active, PA-API access requires some initial performance.
   - After eligibility, you can create API credentials via the “Product Advertising API” section (under Tools).

3) Create PA-API access keys
   - Go to the “Product Advertising API” console, create an Access Key and Secret Key pair.
   - These are distinct from regular IAM keys; use keys generated via PA-API flow.
   - You will also need your partner tag (store ID), e.g., aquabuilder-20.

Environment variables
- AMAZON_ACCESS_KEY: your PA-API access key
- AMAZON_SECRET_KEY: your PA-API secret key
- AMAZON_PARTNER_TAG: your Associates store ID (partner tag), e.g., aquabuilder-20
- AMAZON_REGION: AWS region for PA-API (default us-east-1)
- AMAZON_HOST: PA-API host (default webservices.amazon.com)
- AMAZON_REFRESH_MS: optional, background refresh interval in ms (default 600000)

Where to set them
- Web (Next.js) runtime: set as environment variables in Vercel (Project Settings → Environment Variables)
- Scraper workers: set in your worker hosting provider (Fly.io, Render, etc.)

Validating your setup
1) Set the env vars in both web and scraper services.
2) In Admin → Prices:
   - Enter an Amazon product URL or ASIN and click “Save Amazon Link”, then “Fetch Latest from Amazon”.
   - A price row with retailer Amazon should appear; “Buy” link opens an affiliate URL.
3) Browse → equipment tabs:
   - “Popular on Amazon” panels should load products with images and prices.

Notes
- In dev/offline, the system falls back to synthetic prices and error envelopes so you can still use the app.
- Keep API usage within Amazon policies; the Popular endpoint caches for 10 minutes to reduce calls.

