import * as React from 'react';

export function Chip({
  children,
  active,
  onClick,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}) {
  const base = 'px-3 py-1 rounded-full text-xs cursor-pointer transition-all border';
  const style = active
    ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-md shadow-green-200 border-transparent'
    : 'bg-white text-gray-700 hover:shadow border-gray-200';
  return (
    <button type="button" onClick={onClick} className={[base, style, className].join(' ')} aria-pressed={!!active} {...props}>
      {children}
    </button>
  );
}
