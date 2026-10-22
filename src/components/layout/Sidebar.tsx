// src/components/layout/Sidebar.tsx
"use client";

import { FileMinus, FileSliders } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FiBarChart2,
  FiBell,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
    FiChevronRight,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiFileMinus,
  FiFileText,
  FiGift,
  FiGrid,
  FiHelpCircle,
  FiInbox,
  FiLock,
  FiMinus,
  FiMinusCircle,
  FiPackage,
  FiPieChart,
  FiPlay,
  FiPlayCircle,
  FiSettings,
  FiShield,
  FiSliders,
  FiTag,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import {
  RiFile2Fill,
  RiFile3Fill,
  RiFile4Line,
  RiFileAddFill,
  RiFileForbidLine,
  RiFileSettingsFill,
  RiFileTextLine,
} from "react-icons/ri";

const sidebarIcons = {
  // Platform Admin
  dashboard: FiGrid,
  tenants: FiBriefcase,
  "tenant-detail": FiBriefcase,
  pricing: FiTag,
  billing: FiCreditCard,
  users: FiUsers,
  modules: FiGrid,
  analytics: FiBarChart2,
  support: FiHelpCircle,
  settings: FiSettings,

  // HRIS
  overview: FiGrid,
  "hris-employee": FiUsers,
  attendance: FiCalendar,
  leave: FiCalendar,
  appraisal: FiBarChart2,
    conduct: FiUsers,
  "bank-requests": FiCreditCard,


  // PAYROLL
  "payroll-dashboard": FiGrid,
  employee: FiUsers,
  payee: FiUsers,
  payruns: FiPlayCircle,
  payslips: FiFileMinus,
  deduction: FiMinus,
  "payroll-wallet": FiDollarSign,
  "payroll-tax": FiDollarSign,
  pension: FiBarChart2,
  "payroll-reports": FiSliders,

  //EMPLOYEE
  "employee-dashboard": FiGrid,
  profile: FiUsers,
  "employee-attendance": FiCalendar,
  "employee-leave": FiCalendar,
  "employee-appraisal": FiBarChart2,
   inbox: FiInbox,
  manager: FiUserCheck,

  // Accounting
  customer: FiUsers,
  items: FiPackage,
  projects: FiBriefcase,
  invoices: FiFileText,
  agents: FiUsers,
  payment: FiCreditCard,
  expenses: FiDollarSign,
  reminders: FiCalendar,
  reports: FiPieChart,
  tax: FiFileText,
  wallet: FiDollarSign,

  // Tenant Admin
  organisation: FiBriefcase,
  permissions: FiShield,
  security: FiLock,
  audit: FiFileText,
  notifications: FiBell,
  "general-settings": FiSliders,
};

export type SidebarItem = {
  label: string;
  href?: string;
  icon?: keyof typeof sidebarIcons;
  children?: {
    label: string;
    href: string;
  }[];
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const [indicator, setIndicator] = useState<{
    top: number;
    height: number;
  } | null>(null);

  const activeHref =
    subItems.find(
      (c) => pathname === c.href || pathname.startsWith(`${c.href}/`),
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
    <div
      ref={containerRef}
      className="relative ml-5 border-l border-slate-200 pl-2"
    >
      {/* Static track */}
      <div className="absolute left-0 top-0 h-full w-px bg-slate-200" />

      {/* Animated sliding indicator */}
      {indicator && (
        <div
          className="absolute left-[-1px] w-0.5 rounded-full bg-[#2183C6] transition-all duration-300 ease-out"
          style={{
            top: indicator.top,
            height: indicator.height,
          }}
        />
      )}

      <div className="space-y-0.5">
        {subItems.map((child) => {
          const childActive =
            pathname === child.href || pathname.startsWith(`${child.href}/`);

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
        (item.href &&
          (pathname === item.href || pathname.startsWith(`${item.href}/`))) ||
        item.children?.some(
          (c) => pathname === c.href || pathname.startsWith(`${c.href}/`),
        )
      ) {
        initial[item.label] = true;
      }
    });

    return initial;
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Module title */}
      <div className="flex h-10 shrink-0 items-center border-b border-slate-100 px-4 text-xs font-medium uppercase tracking-wide text-slate-400">
        {title}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3 text-sm">
        {items.map((item) => {
          /*
           * GROUP WITH CHILDREN
           */
          if (item.children && item.children.length > 0) {
            const isOpen = openGroups[item.label] ?? false;

            const isGroupActive =
              (item.href
                ? pathname === item.href || pathname.startsWith(`${item.href}/`)
                : false) ||
              item.children.some(
                (c) => pathname === c.href || pathname.startsWith(`${c.href}/`),
              );

            const Icon = item.icon ? sidebarIcons[item.icon] : null;

            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => {
                    toggleGroup(item.label);

                    if (item.href) {
                      router.push(item.href);
                    }
                  }}
                  className={`flex w-full items-center justify-between rounded px-3 py-2 transition-colors ${
                    isGroupActive
                      ? "bg-[#2183C6] text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {Icon && <Icon size={17} strokeWidth={1.8} />}

                    <span>{item.label}</span>
                  </span>

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

          /*
           * REGULAR ITEM
           */
          const isActive = item.href
            ? pathname === item.href || pathname.startsWith(`${item.href}/`)
            : false;

          const Icon = item.icon ? sidebarIcons[item.icon] : null;

          return (
            <Link
              key={item.label}
              href={item.href ?? "#"}
              className={`flex items-center gap-3 rounded px-3 py-2 transition-colors ${
                isActive
                  ? "bg-[#2183C6] text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {Icon && <Icon size={17} strokeWidth={1.8} />}

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
