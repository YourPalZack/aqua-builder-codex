/*
 QA/Test Agent: runs feature checks and suggests responsible sub-agent on failure.
 Run: pnpm qa
*/

import assert from 'node:assert';

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
  all.push(...await testPartsFilters());
  all.push(...await testPartsInvalidCategory());
  all.push(...await testPartsInvalidParams());
  all.push(...await testAdminPricePost());
  all.push(...await testInitialCostRoute());
  all.push(...await testOgRoute());
  summarize(all);
}

main().catch(e => { console.error(e); process.exit(1); });
