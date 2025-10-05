export function recommendLightCoverage({ tankLengthCm }:{ tankLengthCm:number }){
  // Aim for full coverage; allow small margin
  const coverageMinCm = Math.ceil(tankLengthCm * 0.9);
  return { coverageMinCm };
}

export function recommendSubstrate({ buildType }:{ buildType:string }){
  if (buildType.includes('PLANTED')) return ['SOIL','SAND'] as const;
  if (buildType.includes('REEF')) return ['BARE_BOTTOM','SAND'] as const;
  return ['GRAVEL','SAND'] as const;
}

