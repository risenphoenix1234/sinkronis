// app/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiStar } from "react-icons/fi";
import {
  getInvoiceTemplates,
  createInvoiceTemplate,
  updateInvoiceTemplate,
  deleteInvoiceTemplate,
  setDefaultInvoiceTemplate,
  getExpenseCategories,
  createExpenseCategory,
  deleteExpenseCategory,
  getReminderSettings,
  updateReminderSettings,
} from "@/lib/api/accounting";
import {
  InvoiceTemplate,
  CreateInvoiceTemplatePayload,
  ExpenseCategory,
  ReminderSettings,
} from "@/lib/api/types/accounting.types";
import InvoiceTemplateModal from "@/components/modals/InvoiceTemplateModal";
import ExpenseCategoryModal from "@/components/modals/ExpenseCategoryModal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";

type Tab = "templates" | "categories" | "reminders";

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("templates");

  // Invoice Templates state
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [templateModal, setTemplateModal] = useState<{ open: boolean; mode: "edit" | "create"; template: InvoiceTemplate | null }>({
    open: false,
    mode: "create",
    template: null,
  });
  const [deleteTemplate, setDeleteTemplate] = useState<InvoiceTemplate | null>(null);

  // Expense Categories state
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categoryModal, setCategoryModal] = useState<{ open: boolean; mode: "edit" | "create"; category: ExpenseCategory | null }>({
    open: false,
    mode: "create",
    category: null,
  });
  const [deleteCategory, setDeleteCategory] = useState<ExpenseCategory | null>(null);

  // Reminders state
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings | null>(null);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [reminderError, setReminderError] = useState<string | null>(null);
  const [savingReminders, setSavingReminders] = useState(false);

  // --- Load data ---
  useEffect(() => {
    let cancelled = false;
    getInvoiceTemplates()
      .then((res) => { if (!cancelled) setTemplates(res.data); })
      .catch((err) => { if (!cancelled) setTemplateError(err instanceof Error ? err.message : "Failed to load templates"); })
      .finally(() => { if (!cancelled) setLoadingTemplates(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getExpenseCategories()
      .then((res) => { if (!cancelled) setCategories(res.data); })
      .catch((err) => { if (!cancelled) setCategoryError(err instanceof Error ? err.message : "Failed to load categories"); })
      .finally(() => { if (!cancelled) setLoadingCategories(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getReminderSettings()
      .then((res) => { if (!cancelled) setReminderSettings(res.data); })
      .catch((err) => { if (!cancelled) setReminderError(err instanceof Error ? err.message : "Failed to load reminder settings"); })
      .finally(() => { if (!cancelled) setLoadingReminders(false); });
    return () => { cancelled = true; };
  }, []);

  // --- Invoice Template handlers ---
  const handleSaveTemplate = async (data: CreateInvoiceTemplatePayload, id?: string) => {
    setTemplateError(null);
    try {
      if (id) {
        const res = await updateInvoiceTemplate(id, data);
        setTemplates((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      } else {
        const res = await createInvoiceTemplate(data);
        setTemplates((prev) => [...prev, res.data]);
      }
      setTemplateModal({ open: false, mode: "create", template: null });
    } catch (err) {
      setTemplateError(err instanceof Error ? err.message : "Failed to save template");
    }
  };

  const handleSetDefault = async (id: string) => {
    setTemplateError(null);
    try {
      await setDefaultInvoiceTemplate(id);
      setTemplates((prev) => prev.map((t) => ({ ...t, isDefault: t.id === id })));
    } catch (err) {
      setTemplateError(err instanceof Error ? err.message : "Failed to set default template");
    }
  };

  const handleDeleteTemplate = async () => {
    if (!deleteTemplate) return;
    setTemplateError(null);
    try {
      await deleteInvoiceTemplate(deleteTemplate.id);
      setTemplates((prev) => prev.filter((t) => t.id !== deleteTemplate.id));
    } catch (err) {
      // The backend returns 409 if this is the default template
      setTemplateError(
        err instanceof Error ? err.message : "Failed to delete template — it may be the default template."
      );
    }
    setDeleteTemplate(null);
  };

  // --- Expense Category handlers ---
  const handleSaveCategory = async (data: { name: string; description?: string }, id?: string) => {
    setCategoryError(null);
    if (id) {
      // No PATCH endpoint exists for expense categories yet
      setCategoryError("Editing categories isn't supported by the backend yet.");
      return;
    }
    try {
      const res = await createExpenseCategory(data);
      setCategories((prev) => [...prev, res.data]);
      setCategoryModal({ open: false, mode: "create", category: null });
    } catch (err) {
      setCategoryError(err instanceof Error ? err.message : "Failed to create category");
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategory) return;
    setCategoryError(null);
    try {
      await deleteExpenseCategory(deleteCategory.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteCategory.id));
    } catch (err) {
      // Backend calls this "safely delete unused" — likely 409 if category is in use
      setCategoryError(
        err instanceof Error ? err.message : "Failed to delete category — it may be in use."
      );
    }
    setDeleteCategory(null);
  };

  // --- Reminder handlers ---
const handleReminderChange = async (patch: Partial<ReminderSettings>) => {
  if (!reminderSettings) return;
  const next = { ...reminderSettings, ...patch };
  setReminderSettings(next); // optimistic update
  setSavingReminders(true);
  setReminderError(null);
  try {
    const res = await updateReminderSettings(next); // send the FULL object, not just the patch
    setReminderSettings(res.data);
  } catch (err) {
    setReminderSettings(reminderSettings); // revert on failure
    setReminderError(err instanceof Error ? err.message : "Failed to update reminder settings");
  } finally {
    setSavingReminders(false);
  }
};

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage invoice templates and expense categories
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {([
          { id: "templates", label: "Invoice Templates" },
          { id: "categories", label: "Expense Categories" },
          { id: "reminders", label: "Reminders" },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium ${
              tab === t.id
                ? "border-b-2 border-sky-600 text-sky-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Invoice Templates tab */}
      {tab === "templates" && (
        <div className="space-y-4">
          {templateError && (
            <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600">{templateError}</div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{templates.length} templates configured</p>
            <button
              onClick={() => setTemplateModal({ open: true, mode: "create", template: null })}
              className="flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
            >
              <FiPlus size={14} /> New Template
            </button>
          </div>

          {loadingTemplates ? (
            <p className="py-10 text-center text-sm text-slate-400">Loading templates…</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {templates.length === 0 && (
                <p className="col-span-2 py-10 text-center text-sm text-slate-400">No templates yet.</p>
              )}
              {templates.map((tpl) => (
                <div key={tpl.id} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{tpl.name}</p>
                    {tpl.isDefault && (
                      <span className="flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-600">
                        <FiStar size={11} /> Default
                      </span>
                    )}
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Header Note</p>
                      <p className="text-slate-600">{tpl.headerNote || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Footer Note</p>
                      <p className="text-slate-600">{tpl.footerNote || "—"}</p>
                    </div>
                  </div>

                  {tpl.paymentTerms && (
                    <div className="mt-3">
                      <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                        {tpl.paymentTerms}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-sm">
                    <button
                      onClick={() => setTemplateModal({ open: true, mode: "edit", template: tpl })}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-sky-600"
                    >
                      <FiEdit2 size={13} /> Edit
                    </button>
                    {!tpl.isDefault && (
                      <button
                        onClick={() => handleSetDefault(tpl.id)}
                        className="flex items-center gap-1.5 text-slate-500 hover:text-sky-600"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteTemplate(tpl)}
                      className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600"
                    >
                      <FiTrash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expense Categories tab */}
      {tab === "categories" && (
        <div className="space-y-4">
          {categoryError && (
            <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600">{categoryError}</div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{categories.length} categories configured</p>
            <button
              onClick={() => setCategoryModal({ open: true, mode: "create", category: null })}
              className="flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
            >
              <FiPlus size={14} /> New Category
            </button>
          </div>

          {loadingCategories ? (
            <p className="py-10 text-center text-sm text-slate-400">Loading categories…</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="divide-y divide-slate-100">
                {categories.length === 0 && (
                  <p className="px-5 py-10 text-center text-sm text-slate-400">No categories yet.</p>
                )}
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{cat.name}</p>
                      <p className="text-xs text-slate-400">{cat.description || "No description"}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <button
                        onClick={() => setDeleteCategory(cat)}
                        className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600"
                      >
                        <FiTrash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reminders tab */}
      {tab === "reminders" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Control how and when automated payment reminders are sent
          </p>

          {reminderError && (
            <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600">{reminderError}</div>
          )}

          {loadingReminders || !reminderSettings ? (
            <p className="py-10 text-center text-sm text-slate-400">Loading reminder settings…</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-slate-800">Automatic Reminders</p>
                  <p className="text-xs text-slate-400">Send reminders automatically without manual action</p>
                </div>
                <button
                  disabled={savingReminders}
                  onClick={() => handleReminderChange({ automaticRemindersEnabled: !reminderSettings.automaticRemindersEnabled })}
                  className={`relative h-6 w-11 flex-shrink-0 overflow-hidden rounded-full transition-colors disabled:opacity-60 ${
                    reminderSettings.automaticRemindersEnabled ? "bg-sky-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      reminderSettings.automaticRemindersEnabled ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-slate-800">In-App Notifications</p>
                  <p className="text-xs text-slate-400">Show reminders inside the app</p>
                </div>
                <button
                  disabled={savingReminders}
                  onClick={() => handleReminderChange({ inAppEnabled: !reminderSettings.inAppEnabled })}
                  className={`relative h-6 w-11 flex-shrink-0 overflow-hidden rounded-full transition-colors disabled:opacity-60 ${
                    reminderSettings.inAppEnabled ? "bg-sky-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      reminderSettings.inAppEnabled ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-slate-800">Email Notifications</p>
                  <p className="text-xs text-slate-400">Send reminders by email</p>
                </div>
                <button
                  disabled={savingReminders}
                  onClick={() => handleReminderChange({ emailEnabled: !reminderSettings.emailEnabled })}
                  className={`relative h-6 w-11 flex-shrink-0 overflow-hidden rounded-full transition-colors disabled:opacity-60 ${
                    reminderSettings.emailEnabled ? "bg-sky-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      reminderSettings.emailEnabled ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-slate-800">First Reminder</p>
                  <p className="text-xs text-slate-400">Days before due date to send the first reminder</p>
                </div>
                <input
                  type="number"
                  min={0}
                  disabled={savingReminders}
                  value={reminderSettings.firstReminderDaysBeforeDue}
                  onChange={(e) => handleReminderChange({ firstReminderDaysBeforeDue: Number(e.target.value) })}
                  className="w-20 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-slate-800">Overdue Reminder Frequency</p>
                  <p className="text-xs text-slate-400">How often to remind about overdue invoices</p>
                </div>
                <select
                  disabled={savingReminders}
                  value={reminderSettings.overdueReminderFrequency}
                  onChange={(e) => handleReminderChange({ overdueReminderFrequency: e.target.value })}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 focus:border-sky-400 focus:outline-none"
                >
                  <option value="EVERY_3_DAYS">Every 3 days</option>
                  <option value="EVERY_7_DAYS">Every 7 days</option>
                  <option value="EVERY_14_DAYS">Every 14 days</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <InvoiceTemplateModal
        open={templateModal.open}
        mode={templateModal.mode}
        template={templateModal.template}
        onClose={() => setTemplateModal({ open: false, mode: "create", template: null })}
        onSave={handleSaveTemplate}
      />
      <ConfirmDeleteModal
        open={!!deleteTemplate}
        title="Delete Template"
        description={`Are you sure you want to delete "${deleteTemplate?.name}"? This can't be undone.`}
        onClose={() => setDeleteTemplate(null)}
        onConfirm={handleDeleteTemplate}
      />

      <ExpenseCategoryModal
        open={categoryModal.open}
        mode={categoryModal.mode}
        category={categoryModal.category}
        onClose={() => setCategoryModal({ open: false, mode: "create", category: null })}
        onSave={handleSaveCategory}
      />
      <ConfirmDeleteModal
        open={!!deleteCategory}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteCategory?.name}"? This can't be undone.`}
        onClose={() => setDeleteCategory(null)}
        onConfirm={handleDeleteCategory}
      />
    </section>
  );
}