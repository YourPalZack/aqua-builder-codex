import React from 'react';
import { Chip } from './chip';

export function SpecPills({ items }:{ items: Array<string | null | undefined> }){
  const list = items.filter(Boolean) as string[];
  if (!list.length) return null;
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {list.map((t,i)=> (<Chip key={i} active={false}>{t}</Chip>))}
    </div>
  );
}

