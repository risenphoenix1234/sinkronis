"use client";

import {
  ArrowRight,
  ClipboardCheck,
  FileText,
  Flag,
  TriangleAlert,
  CheckCircle2,
} from "lucide-react";

import { InboxItem } from "@/types/employee/inbox";

interface Props {
  item: InboxItem;
}

export default function InboxCard({ item }: Props) {
  const icon = () => {
    switch (item.type) {
      case "goal":
        return (
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
            <Flag className="w-5 h-5 text-blue-600" />
          </div>
        );

      case "assessment":
        return (
          <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-yellow-600" />
          </div>
        );

      case "leave":
        return (
          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
        );

      case "payslip":
        return (
          <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-500" />
          </div>
        );

      default:
        return (
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
            <TriangleAlert className="w-5 h-5 text-red-500" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 px-5 py-5 flex justify-between items-center hover:shadow-sm transition">
      <div className="flex gap-4">
        {icon()}

        <div>
          <h3 className="font-semibold text-gray-900">{item.title}</h3>

          <p className="text-sm text-gray-500 mt-1">{item.description}</p>

          <p className="text-xs text-gray-400 mt-2">{item.date}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium
                    ${
                      item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
        >
          {item.status}
        </span>

        <button className="flex items-center gap-1 text-sm text-blue-600 font-medium">
          Go to
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
