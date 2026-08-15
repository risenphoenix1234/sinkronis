"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import NewTemplate from "@/components/hris/appraisal-details/NewTemplateForm";
import TemplateView from "@/components/hris/appraisal-details/NewTemplateView";
import { TemplateCard } from "@/components/hris/appraisal-details/TemplateCard";

import { ratingScale, templates } from "@/data/hris/appraisal";

type ModalType = "new" | "preview" | "edit" | null;

export default function AppraisalSettings() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  /* ------------------------------------------------------------------------ */
  /* Modal handlers                                                           */
  /* ------------------------------------------------------------------------ */

  const openModal = (modal: Exclude<ModalType, null>) => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      {/* ==================================================================== */}
      {/* APPRAISAL SETTINGS PAGE                                              */}
      {/* ==================================================================== */}

      <main className="min-h-screen bg-white p-4 sm:p-5 lg:p-6">
        {/* ------------------------------------------------------------------ */}
        {/* Header                                                             */}
        {/* ------------------------------------------------------------------ */}

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

          {/* ---------------------------------------------------------------- */}
          {/* Template Cards                                                   */}
          {/* ---------------------------------------------------------------- */}

          <div className="mt-5 space-y-3">
            {templates.map((template) => (
              <TemplateCard
                key={template.name}
                template={template}
                onPreview={() => openModal("preview")}
                onEdit={() => openModal("edit")}
              />
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Rating Scale                                                       */}
        {/* ------------------------------------------------------------------ */}

        <RatingScale />
      </main>

      {/* ==================================================================== */}
      {/* MODALS                                                               */}
      {/* ==================================================================== */}

      {/* -------------------------------------------------------------------- */}
      {/* New Template                                                         */}
      {/* -------------------------------------------------------------------- */}

      <NewTemplate isOpen={activeModal === "new"} onClose={closeModal} />

      {/* -------------------------------------------------------------------- */}
      {/* Template Preview                                                     */}
      {/* -------------------------------------------------------------------- */}

      <TemplateView isOpen={activeModal === "edit"} onClose={closeModal} />

      {/* -------------------------------------------------------------------- */}
      {/* Edit Template                                                        */}
      {/* -------------------------------------------------------------------- */}

      <TemplateView isOpen={activeModal === "preview"} onClose={closeModal} />
    </>
  );
}

/* ========================================================================== */
/* RATING SCALE                                                               */
/* ========================================================================== */

function RatingScale() {
  const frequencies = ["Monthly", "Quarterly", "BiAnnual", "Annual"];

  return (
    <section className="mt-6 overflow-hidden rounded-md border border-[#E5E9EF]">
      {/* -------------------------------------------------------------------- */}
      {/* Rating Scale Header                                                  */}
      {/* -------------------------------------------------------------------- */}

      <div className="flex flex-col gap-2 border-b border-[#E5E9EF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-bold text-[#1F2937]">OKR Rating Scale</h2>

        <span className="text-xs text-[#94A3B8] sm:text-sm">
          Applied to Grand Total score (Section A + Section B)
        </span>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Rating Items                                                         */}
      {/* -------------------------------------------------------------------- */}

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

      {/* -------------------------------------------------------------------- */}
      {/* Review Frequency                                                     */}
      {/* -------------------------------------------------------------------- */}

      <div className="p-4 sm:p-5">
        <h2 className="font-bold text-[#1F2937]">Default Review Frequency</h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {frequencies.map((frequency) => (
            <button
              key={frequency}
              type="button"
              className="rounded border border-[#D9DEE7] bg-white px-4 py-2 text-sm text-black transition hover:border-[#2388D0] hover:text-[#2388D0] focus:outline-none focus:ring-2 focus:ring-[#2388D0] focus:ring-offset-1"
            >
              {frequency}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
