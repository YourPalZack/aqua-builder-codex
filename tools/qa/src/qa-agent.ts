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
  const cats = ['fish','filters','heaters','lights','tanks'];
  for (const category of cats) {
    try {
      const mod = await import(`${base}/[category]/route.ts`);
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
    const mod = await import('../../../apps/web/src/app/api/builds/route.ts');
    const body = { name: 'QA Build', buildType: 'FRESH_COMMUNITY', components: { tank: { volumeGal: 10 } } };
    const req = new Request('http://localhost/api/builds', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
    const res = await mod.POST(req);
    // @ts-ignore
    const txt = await res.text?.() ?? '';
    const created = txt ? JSON.parse(txt) : {};
    assert(created && created.id, 'missing id');
    results.push({ name: 'POST /api/builds', ok: true });

    const show = await import('../../../apps/web/src/app/api/builds/[id]/route.ts');
    const data = await callRoute<any>(show.GET, { params: Promise.resolve({ id: created.id }) });
    assert(data && data.id, 'fetch failed');
    results.push({ name: 'GET /api/builds/:id', ok: true });
  } catch (e) {
    results.push({ name: 'build create/fetch', ok: false, error: e, agent: 'Web Agent' });
  }
  return results;
}

async function testCoreCalculations(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  try {
    const core = await import('../../../packages/core/src/bioload.ts');
    const pct = core.calcBioloadPct({ fish: [{ adultSizeCm: 5, bioloadFactor: 1, qty: 10 }], tankGal: 20, filterGph: 100 });
    assert(pct > 0, 'bioload should be > 0');
    results.push({ name: 'core: bioload', ok: true });
  } catch (e) {
    results.push({ name: 'core: bioload', ok: false, error: e, agent: 'Core Agent' });
  }
  try {
    const core = await import('../../../packages/core/src/compatibility.ts');
    const { ok } = core.checkFishParams([
      { tempMinC: 22, tempMaxC: 26, phMin: 6.5, phMax: 7.5 },
      { tempMinC: 24, tempMaxC: 28, phMin: 6.2, phMax: 7.2 },
    ]);
    assert(ok, 'expected overlap');
    results.push({ name: 'core: param overlap', ok: true });
  } catch (e) {
    results.push({ name: 'core: param overlap', ok: false, error: e, agent: 'Core Agent' });
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
  all.push(...await testCoreCalculations());
  summarize(all);
}

main().catch(e => { console.error(e); process.exit(1); });

