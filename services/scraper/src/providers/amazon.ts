import { signSigV4 } from './aws-sigv4';

export type AmazonGetItemsResult = {
  priceCents?: number;
  inStock?: boolean;
  url?: string;
  title?: string;
};

export function extractAsin(input: string): string | null {
  try {
    const u = new URL(input);
    const qp = u.searchParams.get('ASIN') || u.searchParams.get('asin');
    if (qp && /^[A-Z0-9]{10}$/.test(qp)) return qp.toUpperCase();
    const m = u.pathname.match(/\/dp\/([A-Z0-9]{10})/i) || u.pathname.match(/\/gp\/product\/([A-Z0-9]{10})/i);
    if (m && m[1]) return m[1].toUpperCase();
    return null;
  } catch {
    return null;
  }
}

export function withAffiliateTag(url: string, tag: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('tag', tag);
    return u.toString();
  } catch {
    return url.includes('tag=') ? url : `${url}${url.includes('?') ? '&' : '?'}tag=${encodeURIComponent(tag)}`;
  }
}

function amzDateNow(): { amzDate: string; amzDateOnly: string } {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  const mm = pad(d.getUTCMonth() + 1);
  const dd = pad(d.getUTCDate());
  const HH = pad(d.getUTCHours());
  const MM = pad(d.getUTCMinutes());
  const SS = pad(d.getUTCSeconds());
  const amzDateOnly = `${yyyy}${mm}${dd}`;
  return { amzDate: `${amzDateOnly}T${HH}${MM}${SS}Z`, amzDateOnly };
}

export async function getItemViaPaapi(asin: string): Promise<AmazonGetItemsResult> {
  const accessKey = process.env.AMAZON_ACCESS_KEY;
  const secretKey = process.env.AMAZON_SECRET_KEY;
  const partnerTag = process.env.AMAZON_PARTNER_TAG;
  const region = process.env.AMAZON_REGION || 'us-east-1';
  const host = process.env.AMAZON_HOST || 'webservices.amazon.com';
  if (!accessKey || !secretKey || !partnerTag) {
    throw new Error('Amazon PA-API env not configured');
  }

  const body = JSON.stringify({
    ItemIds: [asin],
    Resources: [
      'Images.Primary.Large',
      'ItemInfo.Title',
      'Offers.Listings.Price',
      'Offers.Listings.Availability.Message',
      'DetailPageURL',
    ],
    PartnerTag: partnerTag,
    PartnerType: 'Associates',
    Marketplace: host.includes('amazon.com') ? 'www.amazon.com' : undefined,
  });
  const target = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems';
  const { amzDate } = amzDateNow();
  const headersBase: Record<string, string> = {
    'content-type': 'application/json; charset=UTF-8',
    host,
    'x-amz-date': amzDate,
    'x-amz-target': target,
  };
  const signed = signSigV4({
    method: 'POST',
    service: 'ProductAdvertisingAPI',
    region,
    host,
    path: '/paapi5/getitems',
    headers: headersBase,
    body,
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  });

  const url = `https://${host}/paapi5/getitems`;
  const res = await fetch(url, { method: 'POST', headers: signed.headers, body });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Amazon API error ${res.status}: ${txt}`);
  }
  const json: any = await res.json();
  const item = json?.ItemsResult?.Items?.[0];
  if (!item) return {};
  const price = item?.Offers?.Listings?.[0]?.Price;
  const amount = price?.Amount; // numeric
  const priceCents = typeof amount === 'number' ? Math.round(amount * 100) : undefined;
  const dpUrl: string | undefined = item?.DetailPageURL;
  const title: string | undefined = item?.ItemInfo?.Title?.DisplayValue;
  const inStock = !!item?.Offers?.Listings?.[0];
  return { priceCents, inStock, url: dpUrl ? withAffiliateTag(dpUrl, partnerTag) : undefined, title };
}

export type AmazonSearchItem = {
  asin: string;
  title?: string;
  priceCents?: number;
  url?: string;
  image?: string;
};

export async function searchItemsViaPaapi(params: { keywords: string; searchIndex?: string; limit?: number }): Promise<AmazonSearchItem[]> {
  const accessKey = process.env.AMAZON_ACCESS_KEY;
  const secretKey = process.env.AMAZON_SECRET_KEY;
  const partnerTag = process.env.AMAZON_PARTNER_TAG;
  const region = process.env.AMAZON_REGION || 'us-east-1';
  const host = process.env.AMAZON_HOST || 'webservices.amazon.com';
  if (!accessKey || !secretKey || !partnerTag) {
    throw new Error('Amazon PA-API env not configured');
  }

  const body = JSON.stringify({
    Keywords: params.keywords,
    SearchIndex: params.searchIndex || 'All',
    ItemPage: 1,
    ItemCount: Math.min(10, Math.max(1, params.limit ?? 6)),
    PartnerTag: partnerTag,
    PartnerType: 'Associates',
    Resources: [
      'Images.Primary.Medium',
      'ItemInfo.Title',
      'Offers.Listings.Price',
      'DetailPageURL',
    ],
    Marketplace: host.includes('amazon.com') ? 'www.amazon.com' : undefined,
  });
  const target = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems';
  const { amzDate } = amzDateNow();
  const headersBase: Record<string, string> = {
    'content-type': 'application/json; charset=UTF-8',
    host,
    'x-amz-date': amzDate,
    'x-amz-target': target,
  };
  const signed = signSigV4({
    method: 'POST',
    service: 'ProductAdvertisingAPI',
    region,
    host,
    path: '/paapi5/searchitems',
    headers: headersBase,
    body,
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  });
  const url = `https://${host}/paapi5/searchitems`;
  const res = await fetch(url, { method: 'POST', headers: signed.headers, body });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Amazon API error ${res.status}: ${txt}`);
  }
  const json: any = await res.json();
  const items: any[] = json?.SearchResult?.Items ?? [];
  return items.map((it) => {
    const asin: string | undefined = it?.ASIN;
    const title: string | undefined = it?.ItemInfo?.Title?.DisplayValue;
    const amount = it?.Offers?.Listings?.[0]?.Price?.Amount;
    const priceCents = typeof amount === 'number' ? Math.round(amount * 100) : undefined;
    const dpUrl: string | undefined = it?.DetailPageURL;
    const image: string | undefined = it?.Images?.Primary?.Medium?.URL || it?.Images?.Primary?.Large?.URL;
    return {
      asin: asin ?? '',
      title,
      priceCents,
      url: dpUrl ? withAffiliateTag(dpUrl, partnerTag) : undefined,
      image,
    };
  }).filter((x) => x.asin);
}
