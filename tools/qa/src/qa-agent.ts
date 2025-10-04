/*
 QA/Test Agent: runs feature checks and suggests responsible sub-agent on failure.
 Run: pnpm qa
*/

import assert from 'node:assert';

type TestResult = { name: string; ok: boolean; info?: string; error?: unknown; agent?: string };

async function callRoute<T>(handler: Function, ctx: any): Promise<T> {
  const res = await handler(new Request('http://localhost'), ctx);
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
  all.push(...await testAdminPricePost());
  summarize(all);
}

main().catch(e => { console.error(e); process.exit(1); });
