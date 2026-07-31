// src/components/layout/Sidebar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

function SidebarChildGroup({
  subItems,
  pathname,
}: {
  subItems: { label: string; href: string }[];
  pathname: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(
    null
  );

  const activeHref =
    subItems.find(
      (c) => pathname === c.href || pathname.startsWith(c.href)
    )?.href ?? null;

  useEffect(() => {
    if (!activeHref) {
      setIndicator(null);
      return;
    }
    const el = itemRefs.current[activeHref];
    const container = containerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicator({
        top: elRect.top - containerRect.top,
        height: elRect.height,
      });
    }
  }, [activeHref, subItems]);

  return (
    <div ref={containerRef} className="relative ml-3 mt-0.5 pl-3">
      {/* static track */}
      <div className="absolute left-0 top-0 h-full w-px bg-slate-200" />

      {/* animated sliding indicator */}
      {indicator && (
        <div
          className="absolute left-0 w-0.5 rounded-full bg-[#2183C6] transition-all duration-300 ease-out"
          style={{ top: indicator.top, height: indicator.height }}
        />
      )}

      <div className="space-y-0.5">
        {subItems.map((child) => {
          const childActive =
            pathname === child.href || pathname.startsWith(child.href);
          return (
            <Link
              key={child.href}
              href={child.href}
              ref={(el) => {
                itemRefs.current[child.href] = el;
              }}
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
    </div>
  );
}

export default function Sidebar({ title, items }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    items.forEach((item) => {
      if (
        (item.href && pathname.startsWith(item.href)) ||
        item.children?.some((c) => pathname.startsWith(c.href))
      ) {
        initial[item.label] = true;
      }
    });
    return initial;
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b border-slate-200 px-4">
        <Link href="/landingPage" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Sinkronis"
            width={120}
            height={32}
            className="h-8 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Module title */}
      <div className="flex h-10 shrink-0 items-center border-b border-slate-100 px-4 text-xs font-medium uppercase tracking-wide text-slate-400">
        {title}
      </div>

      {/* Nav items — scrolls internally if it overflows, sidebar itself stays full height */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3 text-sm">
        {items.map((item) => {
          // Group with children
          if (item.children && item.children.length > 0) {
            const isOpen = openGroups[item.label] ?? false;
            const isGroupActive =
              (item.href ? pathname === item.href : false) ||
              item.children.some((c) => pathname.startsWith(c.href));

            return (
              <div key={item.label}>
                <button
                  onClick={() => {
                    toggleGroup(item.label);
                    if (item.href) router.push(item.href);
                  }}
                  className={`flex w-full items-center justify-between rounded px-3 py-2 transition-colors ${
                    isGroupActive
                      ? "bg-[#2183C6] text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{item.label}</span>
                  {isOpen ? (
                    <FiChevronDown size={14} />
                  ) : (
                    <FiChevronRight size={14} />
                  )}
                </button>

                {isOpen && (
                  <SidebarChildGroup
                    subItems={item.children}
                    pathname={pathname}
                  />
                )}
              </div>
            );
          }

          // Regular item
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