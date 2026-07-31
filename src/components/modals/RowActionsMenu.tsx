// src/components/modal/RowActionsMenu.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface RowActionsMenuProps {
  onEditAccess: () => void;
  onRemove: () => void;
}

export default function RowActionsMenu({
  onEditAccess,
  onRemove,
}: RowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Row actions"
        className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg">
          <button
            onClick={() => {
              onEditAccess();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50"
          >
            <span className="text-slate-400">✎</span> Edit Access
          </button>
          <button
            onClick={() => {
              onRemove();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50"
          >
            <span>🗑</span> Remove
          </button>
        </div>
      )}
    </div>
  );
}