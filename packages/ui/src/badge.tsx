import * as React from 'react';

export function Badge({ className = '', variant = 'default', ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'success' | 'warning' | 'destructive' }) {
  const variants: Record<string, string> = {
    default: 'bg-gray-200 text-gray-900',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    destructive: 'bg-red-100 text-red-800',
  };
  return <span className={["inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", variants[variant], className].join(' ')} {...props} />;
}

