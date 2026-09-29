"use client";

import { useEffect, useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

import NewTemplate from "@/components/hris/appraisal-details/NewTemplateForm";
import TemplateView from "@/components/hris/appraisal-details/NewTemplateView";
import { TemplateCard } from "@/components/hris/appraisal-details/TemplateCard";

import {
  createAppraisalCycle,
  getAppraisalSettings,
  getAppraisalTemplateDetail,
  getAppraisalTemplates,
  updateAppraisalSettings,
} from "@/lib/api/hris";
import type {
  AppraisalSettings,
  AppraisalTemplate,
  AppraisalTemplateSummary,
  CreateAppraisalCyclePayload,
} from "@/lib/api/types/hrisTypes";

const RATING_SCALE_BANDS = [
  {
    rating: "5",
    title: "Outstanding",
    range: ">121%",
    background: "bg-green-100",
    text: "text-green-700",
  },
  {
    rating: "4",
    title: "Above Expectation",
    range: "101–120%",
    background: "bg-blue-100",
    text: "text-blue-700",
  },
  {
    rating: "3",
    title: "Meets Expectation",
    range: "80–100%",
    background: "bg-gray-100",
    text: "text-gray-600",
  },
  {
    rating: "2",
    title: "Below Expectation",
    range: "60–79%",
    background: "bg-yellow-100",
    text: "text-yellow-700",
  },
  {
    rating: "1",
    title: "Poor Performance",
    range: "0–59%",
    background: "bg-red-100",
    text: "text-red-600",
  },
];

type ModalType = "new" | "preview" | "edit" | null;

export default function AppraisalSettings() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [settings, setSettings] = useState<AppraisalSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [savingFrequency, setSavingFrequency] = useState(false);

  const [templates, setTemplates] = useState<AppraisalTemplateSummary[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<AppraisalTemplate | null>(null);
  const [templateDetailLoading, setTemplateDetailLoading] = useState(false);

  const openTemplateDetail = async (
    templateId: string,
    modal: "preview" | "edit",
  ) => {
    setTemplateDetailLoading(true);
    try {
      const detail = await getAppraisalTemplateDetail(templateId);
      setSelectedTemplate(detail);
      setActiveModal(modal);
    } catch (err) {
      console.error(
        "Template detail failed:",
        axios.isAxiosError(err) ? err.response?.data : err,
      );
      const apiMsg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to load appraisal template detail";
      toast.error(apiMsg);
    } finally {
      setTemplateDetailLoading(false);
    }
  };

  const refetchTemplates = () => {
    setTemplatesLoading(true);
    setTemplatesError(null);
    getAppraisalTemplates()
      .then((res) => {
        setTemplates(Array.isArray(res?.data) ? res.data : []);
        setTemplatesError(null);
      })
      .catch((err) => {
        console.error(
          "Appraisal templates failed:",
          axios.isAxiosError(err) ? err.response?.data : err,
        );
        const apiMsg = axios.isAxiosError(err)
          ? err.response?.data?.message
          : null;
        const msg =
          apiMsg ||
          (err instanceof Error
            ? err.message
            : "Failed to load appraisal templates.");
        setTemplatesError(msg);
        toast.error(msg);
        setTemplates([]);
      })
      .finally(() => setTemplatesLoading(false));
  };

  const fetchSettings = () => {
    setSettingsLoading(true);
    setSettingsError(null);
    getAppraisalSettings()
      .then((res) => {
        setSettings(res);
        setSettingsError(null);
      })
      .catch((err) => {
        console.error(
          "Appraisal settings failed:",
          axios.isAxiosError(err) ? err.response?.data : err,
        );
        const apiMsg = axios.isAxiosError(err)
          ? err.response?.data?.message
          : null;
        const msg =
          apiMsg ||
          (err instanceof Error
            ? err.message
            : "Failed to load appraisal settings.");
        setSettingsError(msg);
        toast.error(msg);
      })
      .finally(() => setSettingsLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    refetchTemplates();
  }, []);

  const openModal = (modal: Exclude<ModalType, null>) => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedTemplate(null);
  };

  const handleFrequencyChange = async (
    value: AppraisalSettings["defaultReviewFrequency"],
  ) => {
    setSavingFrequency(true);
    try {
      const updated = await updateAppraisalSettings({
        defaultReviewFrequency: value,
      });
      setSettings(updated);
      toast.success("Appraisal review frequency updated successfully");
    } catch (err) {
      console.error(
        "Update settings failed:",
        axios.isAxiosError(err) ? err.response?.data : err,
      );
      const apiMsg = axios.isAxiosError(err)
        ? err.response?.data?.message ||
          (Array.isArray(err.response?.data?.validationErrors)
            ? err.response?.data?.validationErrors[0]?.message
            : null)
        : null;
      toast.error(apiMsg || "Failed to update review frequency");
    } finally {
      setSavingFrequency(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-white p-4 sm:p-5 lg:p-6">
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {/* Page title */}
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-[#1F2937]">
                Appraisal Templates
              </h2>

              <p className="mt-1 max-w-3xl text-sm leading-5 text-[#8492A6]">
                OKR/KRA-based templates define objectives, key results, and
                weights for each appraisal cycle.
              </p>
            </div>

            {/* New Template button */}
            <button
              type="button"
              onClick={() => openModal("new")}
              className="flex h-9 w-fit shrink-0 items-center gap-2 rounded-md bg-[#2388D0] px-4 text-sm font-semibold text-white transition hover:bg-[#1976B8] focus:outline-none focus:ring-2 focus:ring-[#2388D0] focus:ring-offset-2"
            >
              <Plus size={14} />

              <span>New Template</span>
            </button>
          </div>

          {templatesError && (
            <div className="mt-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{templatesError}</span>
              </div>
              <button
                type="button"
                onClick={refetchTemplates}
                className="font-semibold underline hover:text-red-900"
              >
                Retry
              </button>
            </div>
          )}

          <div className="mt-5 space-y-3">
            {templatesLoading ? (
              <p className="text-sm text-[#94A3B8]">Loading templates…</p>
            ) : templates.length === 0 && !templatesError ? (
              <p className="rounded-md border border-dashed border-[#E5E9EF] py-8 text-center text-sm text-[#94A3B8]">
                No templates yet. Create one to get started.
              </p>
            ) : (
              templates.map((template: AppraisalTemplateSummary) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={() => openTemplateDetail(template.id, "preview")}
                  onEdit={() => openTemplateDetail(template.id, "edit")}
                  onArchived={refetchTemplates}
                  loading={templateDetailLoading}
                />
              ))
            )}
          </div>
        </section>

        <RatingScale
          currentFrequency={settings?.defaultReviewFrequency}
          loading={settingsLoading || savingFrequency}
          isSaving={savingFrequency}
          error={settingsError}
          onRetry={fetchSettings}
          onFrequencyChange={handleFrequencyChange}
        />
      </main>
      <NewTemplate
        isOpen={activeModal === "new"}
        onClose={closeModal}
        onCreated={() => {
          refetchTemplates();
          closeModal();
        }}
      />

      <TemplateView
        isOpen={activeModal === "preview" || activeModal === "edit"}
        onClose={closeModal}
        template={selectedTemplate}
        mode={activeModal === "edit" ? "edit" : "preview"}
        onSaved={(updated) => {
          setSelectedTemplate(updated);
          refetchTemplates();
        }}
      />
    </>
  );
}

function RatingScale({
  currentFrequency,
  loading,
  isSaving,
  error,
  onRetry,
  onFrequencyChange,
}: {
  currentFrequency?: string;
  loading: boolean;
  isSaving?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onFrequencyChange: (
    value: AppraisalSettings["defaultReviewFrequency"],
  ) => void;
}) {
  const frequencies: {
    label: string;
    value: AppraisalSettings["defaultReviewFrequency"];
  }[] = [
    { label: "Monthly", value: "MONTHLY" },
    { label: "Quarterly", value: "QUARTERLY" },
    { label: "BiAnnual", value: "BI_ANNUAL" },
    { label: "Annual", value: "ANNUAL" },
  ];

  const normalizedCurrent =
    currentFrequency === "BIANNUAL" ? "BI_ANNUAL" : currentFrequency;

  return (
    <section className="mt-6 overflow-hidden rounded-md border border-[#E5E9EF]">
      <div className="flex flex-col gap-2 border-b border-[#E5E9EF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-bold text-[#1F2937]">OKR Rating Scale</h2>

        <span className="text-xs text-[#94A3B8] sm:text-sm">
          Applied to Grand Total score (Section A + Section B)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {RATING_SCALE_BANDS.map((item) => (
          <div
            key={item.rating}
            className={`min-h-[84px] px-4 py-4 ${item.background}`}
          >
            <div className={`text-xl font-bold ${item.text}`}>
              {item.rating}
            </div>

            <div className={`mt-1 text-sm font-semibold ${item.text}`}>
              {item.title}
            </div>

            <div className={`mt-1 text-xs opacity-80 ${item.text}`}>
              {item.range}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 sm:p-5">
        <h2 className="font-bold text-[#1F2937]">Default Review Frequency</h2>

        {error && (
          <div className="mt-3 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="font-semibold underline hover:text-red-900"
              >
                Retry
              </button>
            )}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {frequencies.map((frequency) => {
            const isActive = !loading && normalizedCurrent === frequency.value;
            return (
              <button
                key={frequency.value}
                type="button"
                onClick={() => onFrequencyChange(frequency.value)}
                disabled={loading || isActive}
                className={`rounded border px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#2388D0] focus:ring-offset-1 disabled:cursor-not-allowed ${
                  isActive
                    ? "border-[#2388D0] bg-[#EBF6FC] font-semibold text-[#2388D0]"
                    : "border-[#D9DEE7] bg-white text-black hover:border-[#2388D0] hover:text-[#2388D0]"
                }`}
              >
                {frequency.label}
              </button>
            );
          })}
        </div>

        {isSaving ? (
          <p className="mt-2 text-xs font-medium text-sky-600 animate-pulse">
            Updating review frequency…
          </p>
        ) : loading ? (
          <p className="mt-2 text-xs text-[#94A3B8]">
            Loading current setting…
          </p>
        ) : null}
      </div>
    </section>
  );
}
