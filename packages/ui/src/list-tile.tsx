import React from 'react';

type ListTileProps = {
  title: React.ReactNode;
  href?: string;
  subtitle?: React.ReactNode;
  leading?: React.ReactNode; // thumbnail or icon
  meta?: React.ReactNode;    // small inline meta under subtitle
  actions?: React.ReactNode; // right-aligned actions (buttons)
  active?: boolean;
  className?: string;
};

export function ListTile({ title, href, subtitle, leading, meta, actions, active, className = '' }: ListTileProps) {
  return (
    <div className={["border rounded-2xl p-3 shadow-sm", active ? 'ring-2 ring-blue-400' : '', className].join(' ')}>
      <div className="flex items-start gap-3">
        {leading ?? <div className="w-12 h-12 rounded bg-sky-100" aria-hidden />}
        <div className="flex-1 min-w-0">
          {href ? (
            <a href={href} className="font-medium hover:underline">{title}</a>
          ) : (
            <div className="font-medium">{title}</div>
          )}
          {subtitle && <div className="text-xs text-gray-600 truncate">{subtitle}</div>}
          {meta}
          {actions && (
            <div className="mt-2 flex justify-between items-center">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

