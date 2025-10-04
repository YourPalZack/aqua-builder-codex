export type Issue = { level: 'WARN' | 'BLOCK' };

export function compatibilityScore(issues: Issue[]) {
  let score = 100;
  const warnCount = issues.filter((i) => i.level === 'WARN').length;
  const blockCount = issues.filter((i) => i.level === 'BLOCK').length;
  score -= Math.min(25, warnCount * 5);
  score -= Math.min(80, blockCount * 40);
  return Math.max(0, Math.min(100, score));
}

export function beginnerFriendlyScore(issues: Issue[], opts?: { saltwater?: boolean; reef?: boolean; co2?: boolean }) {
  let score = 100;
  const warnCount = issues.filter((i) => i.level === 'WARN').length;
  const blockCount = issues.filter((i) => i.level === 'BLOCK').length;
  score -= warnCount * 3 + blockCount * 20;
  if (opts?.saltwater) score -= 10;
  if (opts?.reef) score -= 10;
  if (opts?.co2) score -= 5;
  return Math.max(0, Math.min(100, score));
}

