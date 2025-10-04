"use client";
import * as React from 'react';

type ToastMsg = { id: number; text: string };
const listeners = new Set<(m: ToastMsg) => void>();
let id = 1;

export function showToast(text: string) {
  const msg = { id: id++, text };
  listeners.forEach((fn) => fn(msg));
}

export function ToastContainer() {
  const [toasts, setToasts] = React.useState<ToastMsg[]>([]);
  React.useEffect(() => {
    const handler = (m: ToastMsg) => {
      setToasts((prev) => [...prev, m]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== m.id)), 2200);
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div key={t.id} className="rounded-xl bg-gray-900 text-white text-sm px-3 py-2 shadow-lg shadow-black/20">
          {t.text}
        </div>
      ))}
    </div>
  );
}

