"use client";

import { useState } from "react";
import ProfileCard from "./ProfileCard";
import DocumentsTable from "./DocumentsTable";
import BankDetails from "./BankDetails";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState<"documents" | "bank">("documents");

  return (
    <ProfileCard title="">
      <div className="border-b">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("documents")}
            className={`pb-3 text-sm ${
              activeTab === "documents"
                ? "border-b-2 border-sky-600 font-semibold text-sky-600"
                : "text-gray-500"
            }`}
          >
            Documents
          </button>

          <button
            onClick={() => setActiveTab("bank")}
            className={`pb-3 text-sm ${
              activeTab === "bank"
                ? "border-b-2 border-sky-600 font-semibold text-sky-600"
                : "text-gray-500"
            }`}
          >
            Bank Details
          </button>
        </div>
      </div>

      <div>
        {activeTab === "documents" ? <DocumentsTable /> : <BankDetails />}
      </div>
    </ProfileCard>
  );
}
