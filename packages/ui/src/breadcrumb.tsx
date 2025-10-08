import React from 'react';
import Link from 'next/link';

type Crumb = { href: string; label: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-xs text-gray-600" aria-label="Breadcrumb">
      <ol className="inline-flex items-center gap-2">
        {items.map((c, idx) => (
          <li key={c.href} className="inline-flex items-center gap-2">
            {idx > 0 && <span className="text-gray-400">/</span>}
            <Link href={c.href} className="hover:underline">
              {c.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

