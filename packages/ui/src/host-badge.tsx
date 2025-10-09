import React from 'react';

export function HostBadge({ url }: { url?: string | null }) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname;
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-600" aria-label={`Host ${host}`}>
        <img src={faviconFor(host)} alt="" className="w-3 h-3" />
        <span>{host}</span>
      </span>
    );
  } catch {
    return null;
  }
}

function faviconFor(host: string) {
  const h = host.toLowerCase();
  if (h.includes('amazon')) return 'https://www.amazon.com/favicon.ico';
  if (h.includes('chewy')) return 'https://www.chewy.com/favicon.ico';
  if (h.includes('petco')) return 'https://www.petco.com/favicon.ico';
  if (h.includes('bulkreefsupply') || h.includes('bulk') || h.includes('brs')) return 'https://www.bulkreefsupply.com/favicon.ico';
  return '/globe.svg';
}

