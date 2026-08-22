"use client";

import { useRef } from "react";

import { REPORT_TABS, type ReportTab } from "@/lib/payroll-reports";

export { REPORT_TABS };
export type { ReportTab };

type ReportTabsProps = {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
};

/** Stable slug shared by a tab and the panel it controls. */
function slug(tab: ReportTab) {
  return tab.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function tabId(tab: ReportTab) {
  return `report-tab-${slug(tab)}`;
}

export function tabPanelId(tab: ReportTab) {
  return `report-panel-${slug(tab)}`;
}

export default function ReportTabs({ activeTab, onTabChange }: ReportTabsProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Left/right arrows move between tabs, which is what screen reader and
  // keyboard users expect from a tablist. Focus has to move with the selection:
  // only the active tab is in the tab order, so leaving focus on the old button
  // would strand the user on an element they can no longer tab back to.
  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    const offset =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

    if (offset === 0) return;

    event.preventDefault();

    const next = (index + offset + REPORT_TABS.length) % REPORT_TABS.length;

    onTabChange(REPORT_TABS[next]);
    buttonRefs.current[next]?.focus();
  }

  return (
    <nav
      role="tablist"
      aria-label="Payroll reports"
      className="flex w-full gap-6 overflow-x-auto border-b border-gray-200"
    >
      {REPORT_TABS.map((tab, index) => {
        const isActive = tab === activeTab;

        return (
          <button
            key={tab}
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={tabId(tab)}
            aria-selected={isActive}
            aria-controls={tabPanelId(tab)}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`
              -mb-px
              whitespace-nowrap
              border-b-2
              pb-3
              text-sm
              font-medium
              transition-colors
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-500/40
              ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }
            `}
          >
            {tab}
          </button>
        );
      })}
    </nav>
  );
}
