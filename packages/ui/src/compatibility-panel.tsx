import * as React from 'react';

type Item = { level: 'WARN' | 'BLOCK'; code: string; message: string };

export function CompatibilityPanel({ items }: { items: Item[] }) {
  return (
    <div className="rounded-2xl border p-4 space-y-2">
      {items.length === 0 && <p className="text-sm text-gray-500">No issues detected.</p>}
      {items.map((it, i) => (
        <div key={i} className="flex gap-2 items-start">
          <span aria-hidden>{it.level === 'BLOCK' ? '❌' : '⚠️'}</span>
          <div>
            <div className="font-medium">{it.code}</div>
            <p className="text-sm text-gray-500">{it.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

