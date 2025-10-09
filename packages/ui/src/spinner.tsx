import React from 'react';

export function Spinner({ size='md', srLabel='Loading' }:{ size?: 'sm'|'md'|'lg'; srLabel?: string }){
  const dim = size==='sm' ? 'w-4 h-4' : size==='lg' ? 'w-8 h-8' : 'w-5 h-5';
  return (
    <div role="status" aria-live="polite" className="inline-flex items-center">
      <svg className={[dim, 'animate-spin text-green-500'].join(' ')} viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <span className="sr-only">{srLabel}</span>
    </div>
  );
}

export function LoadingOverlay({ show, children }:{ show:boolean; children: React.ReactNode }){
  return (
    <div className="relative">
      {children}
      {show && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-md">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
}
