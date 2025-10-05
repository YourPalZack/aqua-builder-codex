export type CompatIssue = { level: 'WARN'|'BLOCK'; code: string; message: string };

export function computeFilterTurnoverStatus({ gph, tankGal }:{ gph:number; tankGal:number }): CompatIssue | null {
  if (!gph || !tankGal) return null;
  const turnover = gph / tankGal;
  if (turnover < 2) return { level: 'BLOCK', code: 'FILTER_TOO_WEAK', message: `Turnover ${turnover.toFixed(1)}x < 2x.` };
  if (turnover < 4 || turnover > 10) return { level: 'WARN', code: 'FILTER_TURNOVER', message: `Turnover ${turnover.toFixed(1)}x outside 4–10x.` };
  return null;
}

export function computeHeaterStatus({ wattage, tankGal }:{ wattage:number; tankGal:number }): CompatIssue | null {
  if (!wattage || !tankGal) return null;
  const wpg = wattage / tankGal;
  const min = 3, max = 5;
  const pctLow = (min - wpg) / min;
  const pctHigh = (wpg - max) / max;
  const offPct = Math.max(pctLow, pctHigh);
  if (offPct > 0.4) return { level: 'BLOCK', code: 'HEATER_MISMATCH', message: `Heater ${wattage}W ≈ ${wpg.toFixed(1)} W/gal outside 3–5 by >40%.` };
  if (offPct > 0.2) return { level: 'WARN', code: 'HEATER_NEAR_LIMIT', message: `Heater ≈ ${wpg.toFixed(1)} W/gal outside 3–5 by >20%.` };
  return null;
}

export function computeLightCoverageStatus({ coverageCm, tankLengthCm }:{ coverageCm?:number|null; tankLengthCm?:number|null }): CompatIssue | null {
  if (!coverageCm || !tankLengthCm) return null;
  const deficit = tankLengthCm - coverageCm;
  if (deficit > tankLengthCm * 0.25) return { level: 'BLOCK', code: 'LIGHT_COVERAGE', message: 'Light coverage too short by >25%.' };
  if (deficit > tankLengthCm * 0.10) return { level: 'WARN', code: 'LIGHT_COVERAGE', message: 'Light coverage short by >10%.' };
  return null;
}

export function computeWaterTypeConflicts({ buildType, species }:{ buildType:string; species: Array<{ waterType?: 'FRESH'|'BRACKISH'|'SALT'; reefSafe?: boolean }> }): CompatIssue[] {
  const issues: CompatIssue[] = [];
  const saltBuild = buildType.includes('REEF') || buildType.includes('FOWLR');
  const freshBuild = buildType.includes('FRESH');
  if (saltBuild) {
    const wrong = species.filter(s => s.waterType === 'FRESH');
    if (wrong.length) issues.push({ level:'BLOCK', code:'WATER_TYPE_MISMATCH', message:`Freshwater species in a saltwater build.` });
  } else if (freshBuild) {
    const wrong = species.filter(s => s.waterType === 'SALT');
    if (wrong.length) issues.push({ level:'BLOCK', code:'WATER_TYPE_MISMATCH', message:`Saltwater species in a freshwater build.` });
  }
  return issues;
}

export function computePredationConflicts({ fish, inverts }:{ fish:Array<{ id:string; diet?: 'CARNIVORE'|'OMNIVORE'|'HERBIVORE'; adultSizeCm?:number }>, inverts:Array<{ id:string }> }): CompatIssue[] {
  const issues: CompatIssue[] = [];
  // Simple heuristic: large carnivores (>15cm) may prey on small inverts
  const risky = fish.filter(f => (f.diet === 'CARNIVORE' || (f.adultSizeCm??0) > 15));
  if (risky.length && inverts.length) issues.push({ level:'WARN', code:'PREDATION_RISK', message:'Carnivores may prey on shrimp/snails.' });
  return issues;
}

export function computeAggressionTerritoryRules({ fish, tankGal }:{ fish:Array<{ id:string; temperament?: 'PEACEFUL'|'SEMI_AGGRESSIVE'|'AGGRESSIVE' }>, tankGal?:number }): CompatIssue[] {
  const issues: CompatIssue[] = [];
  const aggressive = fish.filter(f => f.temperament === 'AGGRESSIVE');
  if (aggressive.length > 1 && (tankGal??0) < 75) issues.push({ level:'WARN', code:'AGGRESSION_SPACE', message:'Multiple aggressive fish; consider larger tank/territory.' });
  return issues;
}

export function computeSchoolingWarnings({ selections, catalog }:{ selections:Array<{ id:string; qty:number }>, catalog:Array<{ id:string; schoolingMin?:number|null; commonName?:string }> }): CompatIssue[] {
  const issues: CompatIssue[] = [];
  for (const s of selections) {
    const f = catalog.find(x => x.id === s.id);
    if (f?.schoolingMin && s.qty < f.schoolingMin) {
      issues.push({ level:'WARN', code:'SCHOOLING_MIN', message:`${f.schoolingMin}+ required for groups; you have ${s.qty}.` });
    }
  }
  return issues;
}
