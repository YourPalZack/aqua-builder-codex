import * as React from 'react';

export function Chip({
  children,
  active,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const base = 'px-3 py-1 rounded-full text-xs cursor-pointer transition-all border';
  const style = active
    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-200 border-transparent'
    : 'bg-white text-gray-700 hover:shadow border-gray-200';
  return (
    <button type="button" onClick={onClick} className={[base, style, className].join(' ')}>
      {children}
    </button>
  );
}

