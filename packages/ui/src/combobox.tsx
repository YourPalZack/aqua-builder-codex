"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';

type Option = { value: string; label: string };

export function Combobox({ value, onChange, options, placeholder='Select…' }:{ value: string; onChange:(v:string)=>void; options: Option[]; placeholder?: string }){
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const btnRef = useRef<HTMLButtonElement|null>(null);
  const listRef = useRef<HTMLUListElement|null>(null);

  const filtered = useMemo(()=>{
    const t = q.trim().toLowerCase();
    return options.filter(o => o.label.toLowerCase().includes(t));
  }, [q, options]);

  useEffect(()=>{
    function onKey(e: KeyboardEvent){ if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('keydown', onKey);
    return ()=> document.removeEventListener('keydown', onKey);
  },[]);

  const current = options.find(o => o.value === value);

  return (
    <div className="relative">
      <button type="button" ref={btnRef} className="w-full border rounded-md px-2 py-2 text-left" aria-haspopup="listbox" aria-expanded={open} onClick={()=> setOpen(v => !v)}>
        {current ? current.label : <span className="text-gray-500">{placeholder}</span>}
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full border rounded-md bg-white shadow">
          <div className="p-2"><input className="w-full border rounded px-2 py-1 text-sm" placeholder="Type to filter…" value={q} onChange={(e)=> setQ(e.target.value)} autoFocus /></div>
          <ul className="max-h-56 overflow-auto text-sm" role="listbox" ref={listRef}>
            {filtered.map((o)=> (
              <li key={o.value} className="px-2 py-1 hover:bg-gray-100 cursor-pointer" role="option" aria-selected={o.value===value} onClick={()=> { onChange(o.value); setOpen(false); }}>{o.label}</li>
            ))}
            {filtered.length===0 && <li className="px-2 py-1 text-gray-500">No results</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

