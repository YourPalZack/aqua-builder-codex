import React from 'react';

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="text-center p-8 border rounded-xl bg-white">
      <div className="mx-auto w-10 h-10 rounded-full bg-green-100 mb-3" aria-hidden />
      <div className="text-sm font-medium">{title}</div>
      {description && <div className="text-xs text-gray-600 mt-1">{description}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
