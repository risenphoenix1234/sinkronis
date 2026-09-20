// components/employee/profile/DocumentsTable.tsx
"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import { DocumentItem, downloadEmployeeDocument } from "@/lib/api/employee";

interface DocumentsTableProps {
  documents: DocumentItem[];
}

export default function DocumentsTable({ documents }: DocumentsTableProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  async function handleDownload(doc: DocumentItem) {
    setErrorId(null);
    setDownloadingId(doc.id);

    try {
      const blob = await downloadEmployeeDocument(doc.id);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = doc.originalFileName || doc.documentName || "document";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      setErrorId(doc.id);
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
              Document Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">
              Date Added
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => {
            const isDownloading = downloadingId === doc.id;
            const hasError = errorId === doc.id;

            return (
              <tr key={doc.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{doc.documentName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(doc.dateAdded)}
                </td>
                <td className="px-6 py-4 text-right">
                  {doc.downloadAvailable ? (
                    <>
                      <button
                        onClick={() => handleDownload(doc)}
                        disabled={isDownloading}
                        className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isDownloading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                        {isDownloading ? "Downloading…" : "Download"}
                      </button>
                      {hasError && (
                        <p className="mt-1 text-xs text-red-600">
                          Couldn&apos;t download this file.
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">Unavailable</span>
                  )}
                </td>
              </tr>
            );
          })}

          {documents.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="px-6 py-6 text-center text-sm text-gray-400"
              >
                No documents on file
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
