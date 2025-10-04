import * as React from 'react';

export function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'from-green-500 to-emerald-400' : score >= 60 ? 'from-yellow-500 to-amber-400' : 'from-red-500 to-rose-400';
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white bg-gradient-to-r ${color} shadow-sm`}>
      Score: {score}
    </span>
  );
}

