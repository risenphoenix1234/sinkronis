// src/components/layout/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBell } from "react-icons/fi";

interface NavbarProps {
  title: string;
  notificationCount?: number;
}

export default function Navbar({ title, notificationCount = 2 }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">{title}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          {pathname}
        </span>
      </div>

      <nav className="mr-16 flex items-center gap-4 text-sm text-slate-500">
        <Link
          href="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <FiBell size={18} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-medium leading-none text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Link>
        <button className="overflow-hidden rounded-full border border-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces"
            alt="User avatar"
            width={36}
            height={36}
            className="h-9 w-9 object-cover"
          />
        </button>
      </nav>
    </header>
  );
}