export function rangeOverlap(a: [number, number], b: [number, number]) {
  return Math.max(a[0], b[0]) <= Math.min(a[1], b[1]);
}

export type FishParams = {
  tempMinC: number;
  tempMaxC: number;
  phMin: number;
  phMax: number;
};

export function checkFishParams<T extends FishParams>(fishList: T[]) {
  if (fishList.length === 0) {
    return { temp: [0, 0] as [number, number], ph: [0, 0] as [number, number], ok: true };
  }
  const temp = fishList
    .map((f) => [f.tempMinC, f.tempMaxC] as [number, number])
    .reduce((acc, r) => [Math.max(acc[0], r[0]), Math.min(acc[1], r[1])] as [number, number]);
  const ph = fishList
    .map((f) => [f.phMin, f.phMax] as [number, number])
    .reduce((acc, r) => [Math.max(acc[0], r[0]), Math.min(acc[1], r[1])] as [number, number]);
  return { temp, ph, ok: temp[0] <= temp[1] && ph[0] <= ph[1] };
}

