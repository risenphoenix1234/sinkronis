// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">{title}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          {pathname}
        </span>
      </div>

      <nav className="flex items-center gap-3 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-900">
          Home
        </Link>
        <button className="rounded border border-slate-200 px-3 py-1 text-xs hover:bg-slate-50">
          Dummy User
        </button>
      </nav>
    </header>
  );
}
