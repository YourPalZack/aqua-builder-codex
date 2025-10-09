import React from 'react';

type Dir = 'asc'|'desc'|undefined;
export function SortableHeader({ id, activeId, dir, onSort, children, className=''}:{ id: string; activeId?: string; dir?: Dir; onSort: (id: string)=>void; children: React.ReactNode; className?: string }){
  const isActive = activeId === id;
  const caret = isActive ? (dir==='asc' ? '▲' : '▼') : '';
  const ariaSort = isActive ? (dir==='asc' ? 'ascending' : 'descending') : 'none';
  return (
    <th className={["py-2 sticky top-0 bg-white cursor-pointer select-none", className].join(' ')} onClick={()=> onSort(id)} aria-sort={ariaSort as any}>
      <span className="text-gray-600">{children} {caret}</span>
    </th>
  );
}

