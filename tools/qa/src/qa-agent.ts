/*
 QA/Test Agent: runs feature checks and suggests responsible sub-agent on failure.
 Run: pnpm qa
*/

import assert from 'node:assert';
let lastBuildId: string | null = null;

type TestResult = { name: string; ok: boolean; info?: string; error?: unknown; agent?: string };

async function callRoute<T>(handler: Function, ctx: any, req?: Request): Promise<T> {
  const res = await handler(req ?? new Request('http://localhost'), ctx);
  // NextResponse-like
  // @ts-ignore
  const txt = await res.text?.() ?? '';
  return txt ? JSON.parse(txt) as T : (undefined as unknown as T);
}

async function testPartsEndpoints(): Promise<TestResult[]> {
  const base = '../../../apps/web/src/app/api/parts';
  const results: TestResult[] = [];
  const cats = ['fish','filters','heaters','lights','tanks','substrate','equipment'];
  for (const category of cats) {
    try {
      const mod = await import(`${base}/[category]/route`);
      const data = await callRoute<any[]>(mod.GET, { params: Promise.resolve({ category }) });
      assert(Array.isArray(data));
      results.push({ name: `GET /api/parts/${category}`, ok: true });
    } catch (e) {
      results.push({ name: `GET /api/parts/${category}`, ok: false, error: e, agent: 'Web Agent' });
    }
  }
  return results;
}

async function testPartsFilters(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/parts/[category]/route');
    const req = new Request('http://localhost/api/parts/filters?type=HOB');
    const data = await callRoute<any[]>(mod.GET, { params: Promise.resolve({ category: 'filters' }) }, req);
    if (!Array.isArray(data)) throw new Error('not array');
    results.push({ name: 'GET /api/parts/filters?type=HOB', ok: true });
  } catch (e) {
    results.push({ name: 'GET /api/parts/filters?type=HOB', ok: false, error: e, agent: 'Web Agent' });
  }
  return results;
}

async function testPlantsAndExtrasFilters(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/parts/[category]/route');
    // Plants: lightNeeds filter
    const reqP = new Request('http://localhost/api/parts/plants?lightNeeds=LOW');
    const plants = await callRoute<any[]>(mod.GET, { params: Promise.resolve({ category: 'plants' }) }, reqP);
    if (!Array.isArray(plants)) throw new Error('plants not array');
    results.push({ name: 'GET /api/parts/plants?lightNeeds=LOW', ok: true });
  } catch (e) {
    results.push({ name: 'GET /api/parts/plants?lightNeeds=LOW', ok: false, error: e, agent: 'Web Agent' });
  }
  try {
    const mod = await import('../../../apps/web/src/app/api/parts/[category]/route');
    // Equipment: category filter
    const reqE = new Request('http://localhost/api/parts/equipment?category=CO2%20Kit');
    const extras = await callRoute<any[]>(mod.GET, { params: Promise.resolve({ category: 'equipment' }) }, reqE);
    if (!Array.isArray(extras)) throw new Error('equipment not array');
    results.push({ name: 'GET /api/parts/equipment?category=CO2 Kit', ok: true });
  } catch (e) {
    results.push({ name: 'GET /api/parts/equipment?category=CO2 Kit', ok: false, error: e, agent: 'Web Agent' });
  }
  return results;
}

async function testPartsCountHeader(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/parts/[category]/route');
    const req = new Request('http://localhost/api/parts/fish?page=1&pageSize=5&count=1');
    await mod.GET(req as any, { params: Promise.resolve({ category: 'fish' }) });
    results.push({ name: 'GET /api/parts/fish with count header', ok: true });
  } catch (e) {
    results.push({ name: 'GET /api/parts/fish with count header', ok: false, error: e, agent: 'Web Agent' });
  }
  return results;
}

async function testPartsInvalidCategory(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/parts/[category]/route');
    const data = await callRoute<any>(mod.GET, { params: Promise.resolve({ category: 'widgets' }) }, new Request('http://localhost/api/parts/widgets'));
    if (!data?.error) throw new Error('expected error for invalid category');
    results.push({ name: 'GET /api/parts/widgets (invalid)', ok: true });
  } catch (e) {
    results.push({ name: 'GET /api/parts/widgets (invalid)', ok: false, error: e, agent: 'Web Agent' });
  }
  return results;
}

async function testPartsInvalidParams(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/parts/[category]/route');
    const req = new Request('http://localhost/api/parts/heaters?wattMin=abc');
    const data = await callRoute<any>(mod.GET, { params: Promise.resolve({ category: 'heaters' }) }, req);
    if (!data?.error) throw new Error('expected error for invalid params');
    results.push({ name: 'GET /api/parts/heaters?wattMin=abc (invalid)', ok: true });
  } catch (e) {
    results.push({ name: 'GET /api/parts/heaters?wattMin=abc (invalid)', ok: false, error: e, agent: 'Web Agent' });
  }
  return results;
}

async function testBuildCreateAndFetch(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/builds/route');
    const body = { name: 'QA Build', buildType: 'FRESH_COMMUNITY', components: { tank: { volumeGal: 10 } } };
    const req = new Request('http://localhost/api/builds', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
    const res = await mod.POST(req);
    // @ts-ignore
    const txt = await res.text?.() ?? '';
    const created = txt ? JSON.parse(txt) : {};
    assert(created && created.id, 'missing id');
    lastBuildId = created.id;
    results.push({ name: 'POST /api/builds', ok: true });

    const show = await import('../../../apps/web/src/app/api/builds/[id]/route');
    const data = await callRoute<any>(show.GET, { params: Promise.resolve({ id: created.id }) });
    assert(data && data.id, 'fetch failed');
    results.push({ name: 'GET /api/builds/:id', ok: true });
  } catch (e) {
    results.push({ name: 'build create/fetch', ok: false, error: e, agent: 'Web Agent' });
  }
  return results;
}

async function testPricesGet(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/prices/[productType]/[productId]/route');
    const rows = await callRoute<any[]>(mod.GET, { params: Promise.resolve({ productType: 'FILTER', productId: 'filter-hob-50' }) });
    if (!Array.isArray(rows)) throw new Error('not array');
    results.push({ name: 'GET /api/prices/:type/:id', ok: true });
  } catch (e) {
    results.push({ name: 'GET /api/prices/:type/:id', ok: false, error: e, agent: 'Web Agent' });
  }
  return results;
}

async function testBuildsList(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/builds/list/route');
    const rows = await callRoute<any[]>(mod.GET, {});
    if (!Array.isArray(rows)) throw new Error('not array');
    results.push({ name: 'GET /api/builds/list', ok: true });
  } catch (e) {
    results.push({ name: 'GET /api/builds/list', ok: false, error: e, agent: 'Web Agent' });
  }
  return results;
}

async function testBuildsListCount(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/builds/list/route');
    const req = new Request('http://localhost/api/builds/list?count=1&page=1&pageSize=5');
    const res: any = await mod.GET(req as any);
    // @ts-ignore
    const txt = await res.text?.();
    const data = txt ? JSON.parse(txt) : {};
    if (!data || !Array.isArray(data.items)) throw new Error('missing items');
    results.push({ name: 'GET /api/builds/list with count', ok: true });
  } catch (e) {
    results.push({ name: 'GET /api/builds/list with count', ok: false, error: e, agent: 'Web Agent' });
  }
  return results;
}

async function testInitialCostRoute(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/costs/initial/route');
    const body = { equipment: { filter: 'filter-hob-50', extras: [] } };
    const req = new Request('http://localhost/api/costs/initial', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
    const res = await mod.POST(req as any);
    // @ts-ignore
    const txt = await res.text?.() ?? '';
    const data = txt ? JSON.parse(txt) : {};
    if (typeof data?.priceCents !== 'number') throw new Error('missing priceCents');
    results.push({ name: 'POST /api/costs/initial', ok: true });
  } catch (e) {
    results.push({ name: 'POST /api/costs/initial', ok: false, error: e, agent: 'Web Agent' });
  }
  return results;
}

async function testOgRoute(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/og/route');
    const req = new Request('http://localhost/api/og?title=QA%20Test');
    const res = await mod.GET(req as any);
    // @ts-ignore
    const svg = await res.text?.() ?? '';
    if (!svg.includes('<svg')) throw new Error('no svg');
    results.push({ name: 'GET /api/og', ok: true });
  } catch (e) {
    results.push({ name: 'GET /api/og', ok: false, error: e, agent: 'Sharing Agent' });
  }
  return results;
}

async function testOgWithId(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/og/route');
    const id = lastBuildId ?? 'unknown';
    const req = new Request(`http://localhost/api/og?id=${id}`);
    const res = await mod.GET(req as any);
    // @ts-ignore
    const svg = await res.text?.() ?? '';
    if (!svg.includes('<svg')) throw new Error('no svg');
    results.push({ name: 'GET /api/og?id=...', ok: true });
  } catch (e) {
    results.push({ name: 'GET /api/og?id=...', ok: false, error: e, agent: 'Sharing Agent' });
  }
  return results;
}

async function testAnalyticsPost(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/analytics/route');
    const req = new Request('http://localhost/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'qa_event', props: { a: 1 } }) });
    const res = await mod.POST(req as any);
    // @ts-ignore
    const txt = await res.text?.() ?? '';
    const data = txt ? JSON.parse(txt) : {};
    if (!data?.ok) throw new Error('analytics not ok');
    results.push({ name: 'POST /api/analytics', ok: true });
  } catch (e) {
    results.push({ name: 'POST /api/analytics', ok: false, error: e, agent: 'Analytics Agent' });
  }
  return results;
}

async function testAmazonPopular(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/amazon/popular/route');
    const req = new Request('http://localhost/api/amazon/popular?category=filters');
    const res = await mod.GET(req as any);
    // @ts-ignore
    const txt = await res.text?.() ?? '';
    const data = txt ? JSON.parse(txt) : {};
    if (!Array.isArray(data) && !data?.error) throw new Error('expected array or error envelope');
    results.push({ name: 'GET /api/amazon/popular?category=filters', ok: true });
  } catch (e) {
    results.push({ name: 'GET /api/amazon/popular?category=filters', ok: false, error: e, agent: 'Web Agent' });
  }
  return results;
}

async function testAdminAmazonFetch(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/admin/amazon/fetch/route');
    const body = { productType: 'FILTER', productId: 'filter-hob-50', url: 'https://www.amazon.com/dp/B000000000' };
    const req = new Request('http://localhost/api/admin/amazon/fetch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const res = await mod.POST(req as any);
    // @ts-ignore
    const txt = await res.text?.() ?? '';
    const data = txt ? JSON.parse(txt) : {};
    const ok = (data && data.id) || (data && data.fallbackRow && data.fallbackRow.id);
    if (!ok) throw new Error('expected created row or fallbackRow');
    results.push({ name: 'POST /api/admin/amazon/fetch', ok: true });
  } catch (e) {
    results.push({ name: 'POST /api/admin/amazon/fetch', ok: false, error: e, agent: 'Admin/Web Agent' });
  }
  return results;
}
async function testAuthLogin(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/auth/login/route');
    const res = await mod.POST();
    // @ts-ignore
    const txt = await res.text?.() ?? '';
    const data = txt ? JSON.parse(txt) : {};
    if (!data?.ok) throw new Error('login not ok');
    results.push({ name: 'POST /api/auth/login', ok: true });
  } catch (e) {
    results.push({ name: 'POST /api/auth/login', ok: false, error: e, agent: 'Auth Agent' });
  }
  return results;
}

async function testAuthSession(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/auth/session/route');
    const res = await mod.GET(new Request('http://localhost/api/auth/session') as any);
    // @ts-ignore
    const txt = await res.text?.() ?? '';
    const data = txt ? JSON.parse(txt) : {};
    if (!data?.ok) throw new Error('session not ok');
    results.push({ name: 'GET /api/auth/session', ok: true });
  } catch (e) {
    results.push({ name: 'GET /api/auth/session', ok: false, error: e, agent: 'Auth Agent' });
  }
  return results;
}

async function testAdminPricePost(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/admin/prices/route');
    const body = { productType: 'FILTER', productId: 'filter-hob-50', retailer: 'QA', priceCents: 1234 };
    const req = new Request('http://localhost/api/admin/prices', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
    const res = await mod.POST(req as any);
    // @ts-ignore
    const txt = await res.text?.() ?? '';
    const created = txt ? JSON.parse(txt) : {};
    if (!created || !created.id) throw new Error('Missing created.id');
    results.push({ name: 'POST /api/admin/prices', ok: true });
  } catch (e) {
    results.push({ name: 'POST /api/admin/prices', ok: false, error: e, agent: 'Pricing/Admin Agent' });
  }
  return results;
}

async function testAlertsInvalid(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const mod = await import('../../../apps/web/src/app/api/alerts/route');
    const req = new Request('http://localhost/api/alerts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    const res = await mod.POST(req as any);
    // @ts-ignore
    const txt = await res.text?.() ?? '';
    const data = txt ? JSON.parse(txt) : {};
    if (!data?.error) throw new Error('expected validation error');
    results.push({ name: 'POST /api/alerts (invalid)', ok: true });
  } catch (e) {
    results.push({ name: 'POST /api/alerts (invalid)', ok: false, error: e, agent: 'Web Agent' });
  }
  return results;
}


function summarize(results: TestResult[]) {
  const failed = results.filter(r => !r.ok);
  console.log('QA Agent Results:');
  for (const r of results) {
    console.log(`- ${r.ok ? '✅' : '❌'} ${r.name}${r.agent ? ` [agent: ${r.agent}]` : ''}`);
    if (!r.ok && r.error) {
      console.log(`  Error: ${r.error}`);
    }
  }
  if (failed.length) {
    console.log(`\nNext actions:`);
    for (const f of failed) {
      console.log(`- Assign to ${f.agent ?? 'Patch Agent'} to investigate ${f.name}`);
    }
    process.exitCode = 1;
  }
}

async function main() {
  const all: TestResult[] = [];
  all.push(...await testPartsEndpoints());
  all.push(...await testBuildCreateAndFetch());
  all.push(...await testPricesGet());
  all.push(...await testBuildsList());
  all.push(...await testBuildsListCount());
  all.push(...await testPartsFilters());
  all.push(...await testPartsCountHeader());
  all.push(...await testPartsInvalidCategory());
  all.push(...await testPartsInvalidParams());
  all.push(...await testPlantsAndExtrasFilters());
  all.push(...await testAdminPricePost());
  all.push(...await testAlertsInvalid());
  all.push(...await testInitialCostRoute());
  all.push(...await testOgRoute());
  all.push(...await testOgWithId());
  all.push(...await testAnalyticsPost());
  all.push(...await testAuthLogin());
  all.push(...await testAuthSession());
  all.push(...await testAmazonPopular());
  all.push(...await testAdminAmazonFetch());
  summarize(all);
}

main().catch(e => { console.error(e); process.exit(1); });
