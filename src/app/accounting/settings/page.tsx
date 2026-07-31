// app/settings/page.tsx
"use client";

import { useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import {
  initialInvoiceTemplates,
  initialExpenseCategories,
  initialReminderRules,
  InvoiceTemplate,
  ExpenseCategory,
  ReminderRule,
} from "@/lib/settings-data";
import InvoiceTemplateModal from "@/components/modals/InvoiceTemplateModal";
import ExpenseCategoryModal from "@/components/modals/ExpenseCategoryModal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";

type Tab = "templates" | "categories" | "reminders";

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("templates");

  // Invoice Templates state
  const [templates, setTemplates] = useState<InvoiceTemplate[]>(initialInvoiceTemplates);
  const [templateModal, setTemplateModal] = useState<{ open: boolean; mode: "edit" | "create"; template: InvoiceTemplate | null }>({
    open: false,
    mode: "create",
    template: null,
  });
  const [deleteTemplate, setDeleteTemplate] = useState<InvoiceTemplate | null>(null);

  // Expense Categories state
  const [categories, setCategories] = useState<ExpenseCategory[]>(initialExpenseCategories);
  const [categoryModal, setCategoryModal] = useState<{ open: boolean; mode: "edit" | "create"; category: ExpenseCategory | null }>({
    open: false,
    mode: "create",
    category: null,
  });
  const [deleteCategory, setDeleteCategory] = useState<ExpenseCategory | null>(null);

  // Reminders state
  const [reminders, setReminders] = useState<ReminderRule[]>(initialReminderRules);

  // --- Invoice Template handlers ---
  const handleSaveTemplate = (data: Omit<InvoiceTemplate, "id" | "isDefault">, id?: string) => {
    if (id) {
      setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    } else {
      setTemplates((prev) => [
        ...prev,
        { ...data, id: `tpl-${Date.now()}`, isDefault: prev.length === 0 },
      ]);
    }
    setTemplateModal({ open: false, mode: "create", template: null });
  };

  const handleSetDefault = (id: string) => {
    setTemplates((prev) => prev.map((t) => ({ ...t, isDefault: t.id === id })));
  };

  const handleDeleteTemplate = () => {
    if (deleteTemplate) {
      setTemplates((prev) => prev.filter((t) => t.id !== deleteTemplate.id));
    }
    setDeleteTemplate(null);
  };

  // --- Expense Category handlers ---
  const handleSaveCategory = (data: Omit<ExpenseCategory, "id">, id?: string) => {
    if (id) {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    } else {
      setCategories((prev) => [...prev, { ...data, id: `cat-${Date.now()}` }]);
    }
    setCategoryModal({ open: false, mode: "create", category: null });
  };

  const handleDeleteCategory = () => {
    if (deleteCategory) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteCategory.id));
    }
    setDeleteCategory(null);
  };

  // --- Reminder handlers ---
  const toggleReminder = (id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
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
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{templates.length} templates configured</p>
            <button
              onClick={() => setTemplateModal({ open: true, mode: "create", template: null })}
              className="flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
            >
              <FiPlus size={14} /> New Template
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div key={tpl.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{tpl.name}</p>
                  {tpl.isDefault && (
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-600">
                      Default
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-slate-400">Header Note</p>
                    <p className="text-slate-600">{tpl.headerNote}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Footer Note</p>
                    <p className="text-slate-600">{tpl.footerNote}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                    {tpl.paymentTerm}
                  </span>
                </div>

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
        </div>
      )}

      {/* Expense Categories tab */}
      {tab === "categories" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{categories.length} categories configured</p>
            <button
              onClick={() => setCategoryModal({ open: true, mode: "create", category: null })}
              className="flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
            >
              <FiPlus size={14} /> New Category
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{cat.name}</p>
                    <p className="text-xs text-slate-400">{cat.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <button
                      onClick={() => setCategoryModal({ open: true, mode: "edit", category: cat })}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-sky-600"
                    >
                      <FiEdit2 size={13} /> Edit
                    </button>
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
        </div>
      )}

      {/* Reminders tab */}
      {tab === "reminders" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Turn automated reminders on or off — these are sent without manual action
          </p>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="divide-y divide-slate-100">
              {reminders.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{rule.label}</p>
                    <p className="text-xs text-slate-400">{rule.trigger}</p>
                  </div>
                  <button
                    onClick={() => toggleReminder(rule.id)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      rule.enabled ? "bg-sky-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        rule.enabled ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
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