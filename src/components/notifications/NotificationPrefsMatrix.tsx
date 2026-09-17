"use client";

import Toggle from "@/components/ui/Toggle";
import { NotificationModulePrefs } from "@/lib/api/types/admin.types";

interface NotificationPrefsMatrixProps {
  modules: NotificationModulePrefs[];
  onToggleCategory: (moduleKey: string, notificationId: string, value: boolean) => void;
  onToggleAll: (moduleKey: string, value: boolean) => void;
  pendingKey: string | null;
}

export default function NotificationPrefsMatrix({
  modules,
  onToggleCategory,
  onToggleAll,
  pendingKey,
}: NotificationPrefsMatrixProps) {
  return (
    <div className="space-y-6">
      {modules.map((mod) => {
        const disabled = !mod.entitled || !mod.controlsEnabled;

        return (
          <div key={mod.moduleKey}>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">{mod.moduleName}</h3>
                {!mod.entitled && (
                  <p className="text-xs text-slate-400">Not included in your current plan</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">All</span>
                <Toggle
                  checked={mod.toggleAll}
                  onChange={(v) => onToggleAll(mod.moduleKey, v)}
                  disabled={disabled || pendingKey === `${mod.moduleKey}:__all__`}
                  ariaLabel={`${mod.moduleName} all notifications`}
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 rounded-md border border-slate-100">
              {mod.notifications.map((cat) => (
                <div
                  key={cat.notificationId}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{cat.categoryName}</p>
                    <p className="text-sm text-slate-500">{cat.description}</p>
                  </div>
                  <Toggle
                    checked={cat.enabled}
                    onChange={(v) => onToggleCategory(mod.moduleKey, cat.notificationId, v)}
                    disabled={disabled || pendingKey === `${mod.moduleKey}:${cat.notificationId}`}
                    ariaLabel={`${mod.moduleName} ${cat.categoryName}`}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}