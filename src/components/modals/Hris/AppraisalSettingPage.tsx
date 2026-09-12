"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import axios from "axios";

import NewTemplate from "@/components/hris/appraisal-details/NewTemplateForm";
import TemplateView from "@/components/hris/appraisal-details/NewTemplateView";
import { TemplateCard } from "@/components/hris/appraisal-details/TemplateCard";

import { ratingScale } from "@/data/hris/appraisal";

import {
  archiveAppraisalTemplate,
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

type ModalType = "new" | "preview" | "edit" | null;

export default function AppraisalSettings() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [settings, setSettings] = useState<AppraisalSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [savingFrequency, setSavingFrequency] = useState(false);

  const [templates, setTemplates] = useState<AppraisalTemplateSummary[]>([]);

  const [templatesLoading, setTemplatesLoading] = useState(true);
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
    } finally {
      setTemplateDetailLoading(false);
    }
  };

  const refetchTemplates = () => {
    setTemplatesLoading(true);
    getAppraisalTemplates()
      .then((res) => setTemplates(res.data))
      .catch((err) => {
        console.error(
          "Appraisal templates failed:",
          axios.isAxiosError(err) ? err.response?.data : err,
        );
      })
      .finally(() => setTemplatesLoading(false));
  };

  const handleArchiveTemplate = async (templateId: string) => {
    if (
      !confirm(
        "Archive this template? It won't be available for future cycles, but existing appraisals using it are unaffected.",
      )
    ) {
      return;
    }
    try {
      await archiveAppraisalTemplate(templateId);
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    } catch (err) {
      console.error(
        "Archive template failed:",
        axios.isAxiosError(err) ? err.response?.data : err,
      );
    }
  };

  useEffect(() => {
    getAppraisalSettings()
      .then((res) => setSettings(res))
      .catch((err) => {
        console.error(
          "Appraisal settings failed:",
          axios.isAxiosError(err) ? err.response?.data : err,
        );
      })
      .finally(() => setSettingsLoading(false));
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
      await updateAppraisalSettings({ defaultReviewFrequency: value });
      setSettings((prev) =>
        prev ? { ...prev, defaultReviewFrequency: value } : prev,
      );
    } catch (err) {
      console.error(
        "Update settings failed:",
        axios.isAxiosError(err) ? err.response?.data : err,
      );
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

          <div className="mt-5 space-y-3">
            {templatesLoading ? (
              <p className="text-sm text-[#94A3B8]">Loading templates…</p>
            ) : templates.length === 0 ? (
              <p className="rounded-md border border-dashed border-[#E5E9EF] py-8 text-center text-sm text-[#94A3B8]">
                No templates yet. Create one to get started.
              </p>
            ) : (
              templates.map((template: any) => (
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
  onFrequencyChange,
}: {
  currentFrequency?: string;
  loading: boolean;
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
    { label: "BiAnnual", value: "BIANNUAL" },
    { label: "Annual", value: "ANNUAL" },
  ];

  return (
    <section className="mt-6 overflow-hidden rounded-md border border-[#E5E9EF]">
      <div className="flex flex-col gap-2 border-b border-[#E5E9EF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-bold text-[#1F2937]">OKR Rating Scale</h2>

        <span className="text-xs text-[#94A3B8] sm:text-sm">
          Applied to Grand Total score (Section A + Section B)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {ratingScale.map((item) => (
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

        <div className="mt-3 flex flex-wrap gap-2">
          {frequencies.map((frequency) => {
            const isActive = !loading && currentFrequency === frequency.value;
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

        {loading && (
          <p className="mt-2 text-xs text-[#94A3B8]">
            Loading current setting…
          </p>
        )}
      </div>
    </section>
  );
}
