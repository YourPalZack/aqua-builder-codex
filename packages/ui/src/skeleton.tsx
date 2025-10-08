import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-md ${className}`} aria-hidden />;
}

