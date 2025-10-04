import * as React from 'react';

export function QuantityStepper({ value, onChange, min = 0, max = 99 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div className="inline-flex items-center border rounded-md overflow-hidden">
      <button type="button" onClick={dec} className="px-2 py-1 text-sm hover:bg-gray-100" aria-label="Decrease">−</button>
      <span className="px-3 text-sm min-w-6 text-center">{value}</span>
      <button type="button" onClick={inc} className="px-2 py-1 text-sm hover:bg-gray-100" aria-label="Increase">+</button>
    </div>
  );
}

