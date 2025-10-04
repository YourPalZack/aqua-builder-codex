import * as React from 'react';

export function Alert({ className = '', variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'warning' | 'destructive' }) {
  const variants: Record<string, string> = {
    default: 'border-gray-200 text-gray-900',
    warning: 'border-yellow-300 text-yellow-900 bg-yellow-50',
    destructive: 'border-red-300 text-red-900 bg-red-50',
  };
  return <div className={["rounded-xl border p-3", variants[variant], className].join(' ')} {...props} />;
}

