import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';

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
    // Placeholder: In real adapters, fetch HTML or API and parse price
    const priceCents = Math.floor(Math.random() * 10000) + 1000;
    await prisma.productPrice.create({
      data: {
        productType: job.data.productType,
        productId: job.data.productId,
        retailer: job.data.retailer,
        priceCents,
        url: job.data.url,
        inStock: true,
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
      retailer: 'DemoRetailer',
      url: 'https://example.com/demo',
    });
  }
}

main().catch((e) => console.error(e));
