import React from 'react';

export function HostFilter({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <select className="border rounded px-2 py-2 text-sm" value={value} onChange={(e)=> onChange(e.target.value)} aria-label="Filter by host">
      <option value="">All hosts</option>
      {options.map(h => (<option key={h} value={h}>{h}</option>))}
    </select>
  );
}

