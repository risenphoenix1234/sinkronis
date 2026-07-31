"use client";

import { Download } from "lucide-react";
import { profile } from "@/data/employee/profile";

export default function DocumentsTable() {
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
          {profile.documents.map((doc) => (
            <tr key={doc.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-sm">{doc.documentName}</td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {doc.dateAdded}
              </td>

              <td className="px-6 py-4 text-right">
                <button className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700">
                  <Download size={16} />
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
