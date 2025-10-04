import * as React from 'react';

export function PriceSparkline({ data }: { data: { t: string; price: number }[] }) {
  // Placeholder sparkline: simple list until charting is wired
  return (
    <div className="text-xs text-gray-600">
      {data.slice(-10).map((d, i) => (
        <span key={i} className="mr-2">{d.price}</span>
      ))}
    </div>
  );
}

