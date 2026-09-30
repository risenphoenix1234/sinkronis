"use client";

import { FileText, Plus } from "lucide-react";

type DocumentItem = {
  id: number;
  name: string;
  uploadedDate: string;
  size: string;
  fileUrl?: string;
};

const documents: DocumentItem[] = [
  {
    id: 1,
    name: "Service Agreement 2026.pdf",
    uploadedDate: "Uploaded Jan 5, 2026",
    size: "348 KB",
  },
  {
    id: 2,
    name: "Tax Compliance Certificate.pdf",
    uploadedDate: "Uploaded Mar 12, 2026",
    size: "218 KB",
  },
  {
    id: 3,
    name: "Company Registration.pdf",
    uploadedDate: "Uploaded Feb 1, 2025",
    size: "1.2 MB",
  },
];

interface DocumentsProps {
  payeeId?: string;
  payeeName?: string;
}

export default function Documents({ payeeId, payeeName }: DocumentsProps = {}) {
  const handleUpload = () => {
    console.log("Upload document for", payeeName || payeeId);
  };

  const handleDownload = (doc: DocumentItem) => {
    if (!doc.fileUrl) {
      console.log(`Download: ${doc.name}`);
      return;
    }

    const link = document.createElement("a");
    link.href = doc.fileUrl;
    link.download = doc.name;
    link.target = "_blank";
    link.click();
  };

  return (
    <section className="w-full rounded border border-[#E5E7EB] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dashed border-[#E5E7EB] px-5 py-3">
        <h2 className="text-sm font-semibold text-[#263342]">Documents</h2>

        <button
          type="button"
          onClick={handleUpload}
          className="flex h-8 items-center gap-1.5 rounded bg-[#1683D8] px-3 text-xs font-medium text-white transition hover:bg-[#0D6EBA]"
        >
          <Plus size={14} strokeWidth={2} />
          Upload
        </button>
      </div>

      {/* Documents */}
      <div className="space-y-2 px-4 py-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex min-h-[55px] items-center justify-between rounded border border-[#E5E7EB] bg-[#FAFBFC] px-4 py-2.5"
          >
            {/* File information */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                <FileText
                  size={17}
                  strokeWidth={1.8}
                  className="text-[#1683D8]"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-[#263342]">
                  {doc.name}
                </p>

                <p className="mt-0.5 text-[10px] text-[#98A2B3]">
                  {doc.uploadedDate} · {doc.size}
                </p>
              </div>
            </div>

            {/* Download */}
            <button
              type="button"
              onClick={() => handleDownload(doc)}
              className="ml-4 shrink-0 text-xs font-medium text-[#1683D8] transition hover:text-[#0D6EBA] hover:underline"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
