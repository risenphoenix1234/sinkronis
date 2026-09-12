"use client";

import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { archiveAppraisalTemplate } from "@/lib/api/hris";
import type { AppraisalTemplateSummary } from "@/lib/api/types/hrisTypes";

type TemplateCardProps = {
  template: AppraisalTemplateSummary;
  onPreview: () => void;
  onEdit: () => void;
  onArchived?: () => void; // parent refetches the list after archiving
  loading?: boolean;
};

export function TemplateCard({
  template,
  onPreview,
  onEdit,
  onArchived,
  loading,
}: TemplateCardProps) {
  const [archiving, setArchiving] = useState(false);

  const handleArchive = async () => {
    const confirmed = window.confirm(
      `Archive "${template.name}"? It won't be available for new appraisal cycles, but existing cycles and appraisals that already use it will be unaffected.`,
    );
    if (!confirmed) return;

    setArchiving(true);
    try {
      await archiveAppraisalTemplate(template.id);
      onArchived?.();
    } catch (err) {
      console.error(
        "Archive template failed:",
        axios.isAxiosError(err) ? err.response?.data : err,
      );
      alert(
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Couldn't archive this template.")
          : "Couldn't archive this template.",
      );
    } finally {
      setArchiving(false);
    }
  };

  return (
    <article className="border border-[#E5E9EF] bg-white px-4 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[#1F2937]">{template.name}</h3>

            {template.isDefault && (
              <Badge className="bg-green-100 text-green-700">Default</Badge>
            )}

            <Badge className="bg-gray-100 text-[#8492A6]">
              v{template.version}
            </Badge>
          </div>

          <p className="mt-1 text-sm text-[#8492A6]">{template.description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-md bg-gray-100 p-1">
          <button
            type="button"
            onClick={onPreview}
            disabled={loading}
            className="flex h-8 items-center gap-1.5 rounded px-3 text-xs font-semibold text-[#667085] transition hover:bg-white hover:text-[#2388D0] disabled:opacity-50"
          >
            <Eye size={13} />
            Preview
          </button>

          <button
            type="button"
            onClick={onEdit}
            disabled={loading}
            className="flex h-8 items-center gap-1.5 rounded px-3 text-xs font-semibold text-[#667085] transition hover:bg-white hover:text-[#2388D0] disabled:opacity-50"
          >
            <Pencil size={13} />
            Edit
          </button>

          {!template.isDefault && (
            <button
              type="button"
              onClick={handleArchive}
              disabled={archiving}
              aria-label={`Archive ${template.name}`}
              className="flex h-8 w-8 items-center justify-center rounded text-[#98A2B3] transition hover:bg-white hover:text-red-500 disabled:opacity-50"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}
