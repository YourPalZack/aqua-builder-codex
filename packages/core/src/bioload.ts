export type BioloadFish = { adultSizeCm: number; bioloadFactor: number; qty: number };

export function calcBioloadPct({
  fish,
  filterGph,
  tankGal,
}: {
  fish: Array<BioloadFish>;
  filterGph?: number;
  tankGal: number;
}) {
  const load = fish.reduce(
    (sum, f) => sum + (f.adultSizeCm / 2.54) * f.bioloadFactor * f.qty,
    0
  );
  const baseline = tankGal * 1;
  const filtrationAdj = 1 * (filterGph ? Math.min(filterGph / (tankGal * 5), 1.4) : 1);
  return (load / (baseline * filtrationAdj)) * 100;
}

