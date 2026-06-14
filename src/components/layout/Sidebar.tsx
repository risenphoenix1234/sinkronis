// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

export type SidebarItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

interface SidebarProps {
  title: string;
  items: SidebarItem[];
}

export default function Sidebar({ title, items }: SidebarProps) {
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.children?.some((c) => pathname.startsWith(c.href))) {
        initial[item.label] = true;
      }
    });
    return initial;
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="flex h-full w-56 flex-col border-r border-slate-200 bg-white">
      <div className="h-14 flex items-center border-b border-slate-200 px-4 text-sm font-semibold">
        {title}
      </div>
      <nav className="flex-1 space-y-0.5 px-2 py-3 text-sm">
        {items.map((item) => {
          if (item.children && item.children.length > 0) {
            const isOpen = openGroups[item.label] ?? false;
            const isGroupActive =
              (item.href ? pathname === item.href : false) ||
              item.children.some((c) => pathname.startsWith(c.href));

            return (
              <div key={item.label}>
                <div
                  className={`flex w-full items-center justify-between rounded px-3 py-2 transition-colors ${
                    isGroupActive
                      ? "bg-[#2183C6] text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Link href={item.href ?? "#"} className="flex-1">
                    {item.label}
                  </Link>
                  <button onClick={() => toggleGroup(item.label)} className="pl-2">
                    {isOpen ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                  </button>
                </div>

                {isOpen && (
                  <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href || pathname.startsWith(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block rounded px-3 py-1.5 text-sm transition-colors ${
                            childActive
                              ? "font-medium text-[#2183C6]"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Regular item — active computed inline here
          const isActive = item.href
            ? pathname === item.href || pathname.startsWith(item.href)
            : false;

          return (
            <Link
              key={item.label}
              href={item.href ?? "#"}
              className={`block rounded px-3 py-2 transition-colors ${
                isActive
                  ? "bg-[#2183C6] text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}