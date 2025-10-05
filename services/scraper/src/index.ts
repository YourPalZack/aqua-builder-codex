import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { extractAsin, getItemViaPaapi, withAffiliateTag } from './providers/amazon';

// Disable workers in dev when REDIS_URL is not configured
if (!process.env.REDIS_URL) {
  console.log('Scraper disabled: set REDIS_URL to enable workers.');
  process.exit(0);
}

const connection = new IORedis(process.env.REDIS_URL);
const prisma = new PrismaClient();

export type PriceJob = { productType: string; productId: string; retailer: string; url: string };

export const priceFetchQueue = new Queue<PriceJob>('price_fetch', { connection });
export const alertsCheckQueue = new Queue('alerts_check', { connection });

new Worker<PriceJob>(
  'price_fetch',
  async (job: Job<PriceJob>) => {
    const { productType, productId, retailer, url } = job.data;
    let priceCents: number | undefined;
    let finalUrl: string | undefined = url;
    let inStock = true;
    try {
      if (retailer.toLowerCase() === 'amazon') {
        const asin = extractAsin(url);
        if (!asin) throw new Error('Missing ASIN in Amazon URL');
        const item = await getItemViaPaapi(asin);
        priceCents = item.priceCents;
        inStock = !!item.inStock;
        finalUrl = item.url ?? withAffiliateTag(url, process.env.AMAZON_PARTNER_TAG || '');
      }
    } catch (e) {
      console.warn('Amazon fetch failed, falling back:', e);
    }
    // Fallback if not Amazon or failure
    if (typeof priceCents !== 'number') {
      priceCents = Math.floor(Math.random() * 10000) + 1000;
    }
    await prisma.productPrice.create({
      data: {
        productType,
        productId,
        retailer,
        priceCents,
        url: finalUrl ?? url,
        inStock,
      },
    });
    return { priceCents };
  },
  { connection }
);

new Worker(
  'alerts_check',
  async () => {
    const alerts = await prisma.priceAlert.findMany({ where: { active: true } });
    // TODO: Check current price vs target and trigger email via provider
    return { count: alerts.length };
  },
  { connection }
);

// Example: enqueue a demo job if run directly
async function main() {
  if (process.env.NODE_ENV !== 'production') {
    await priceFetchQueue.add('demo', {
      productType: 'FILTER',
      productId: 'demo-1',
      retailer: 'Amazon',
      url: 'https://www.amazon.com/dp/B000000000',
    });
  }

  // Background refresh loop for AmazonLink mappings
  const intervalMs = parseInt(process.env.AMAZON_REFRESH_MS || '600000', 10); // default 10 min
  if (!Number.isFinite(intervalMs) || intervalMs < 60000) return; // guard
  setInterval(async () => {
    try {
      const mappings = await prisma.amazonLink.findMany();
      for (const m of mappings) {
        try {
          const item = await getItemViaPaapi(m.asin);
          if (typeof item.priceCents === 'number') {
            await prisma.productPrice.create({
              data: {
                productType: m.productType,
                productId: m.productId,
                retailer: 'Amazon',
                priceCents: item.priceCents,
                currency: 'USD',
                inStock: item.inStock ?? true,
                url: (item.url ?? (m.url ? withAffiliateTag(m.url, process.env.AMAZON_PARTNER_TAG || '') : undefined)) ?? '',
              },
            });
          }
        } catch (e) {
          console.warn('Amazon background refresh failed for', m.productType, m.productId, e);
        }
      }
    } catch (e) {
      // table may not exist or db down
      console.warn('AmazonLink scan skipped:', e);
    }
  }, intervalMs);
}

main().catch((e) => console.error(e));
