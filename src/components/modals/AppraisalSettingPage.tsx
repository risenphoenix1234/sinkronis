"use client";

import { useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import CreateTemplateModal from "./CreateTemplateModal";
import EditTemplateModal from "./EditTemplateModal";

type Template = {
  id: number;
  title: string;
  description: string;
  competencies: number;
  selfAssessment: number;
  managerQuestions: number;
  isDefault?: boolean;
};

const templates: Template[] = [
  {
    id: 1,
    title: "Standard Performance Review",
    description: "General-purpose template suitable for all roles.",
    competencies: 6,
    selfAssessment: 4,
    managerQuestions: 3,
    isDefault: true,
  },
  {
    id: 2,
    title: "Technical / Engineering Review",
    description:
      "Tailored for engineering and technical roles with code quality and delivery focus.",
    competencies: 5,
    selfAssessment: 3,
    managerQuestions: 2,
  },
];

const ratings = [
  {
    score: "90-100%",
    rating: "Outstanding",
    color: "bg-green-100 text-green-700",
  },
  {
    score: "75-89%",
    rating: "Exceeds Expectations",
    color: "bg-blue-100 text-blue-700",
  },
  {
    score: "60-74%",
    rating: "Meets Expectations",
    color: "bg-gray-100 text-gray-700",
  },
  {
    score: "50-59%",
    rating: "Needs Improvement",
    color: "bg-yellow-100 text-yellow-700",
  },
];

export default function AppraisalSettingPage() {
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-[#fafafa] space-y-6">
        {/* Templates Header */}

        <div className="mt-8 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Appraisal Templates
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Templates define the competencies and questions used in each
              appraisal cycle.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <FiPlus />
            New Template
          </button>

          <CreateTemplateModal
            open={showModal}
            onClose={() => setShowModal(false)}
          />
        </div>

        {/* Template Cards */}

        <div className="mt-6 space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="rounded-md border border-gray-200 bg-white p-5"
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">
                      {template.title}
                    </h3>

                    {template.isDefault && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {template.description}
                  </p>

                  <div className="mt-4 flex gap-6 text-sm text-gray-500">
                    <span>{template.competencies} competencies</span>

                    <span>
                      {template.selfAssessment} self-assessment questions
                    </span>

                    <span>{template.managerQuestions} manager questions</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <button
                    onClick={() => setView(true)}
                    className="flex items-center gap-2 rounded border px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <FiEdit2 size={14} />
                    Edit
                  </button>

                  <EditTemplateModal
                    isOpen={view}
                    onClose={() => setView(false)}
                  />
                  
                  {!template.isDefault && (
                    <button className="rounded border p-2 text-gray-500 hover:bg-gray-50">
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rating Table */}

        <div className="mt-8 rounded-md border border-gray-200 bg-white">
          <div className="border-b p-5">
            <h2 className="font-semibold text-gray-900">
              Rating Scale (Final Score)
            </h2>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="px-5 py-4 font-medium">Score</th>

                <th className="px-5 py-4 font-medium">Rating</th>
              </tr>
            </thead>

            <tbody>
              {ratings.map((item) => (
                <tr key={item.score} className="border-b last:border-0">
                  <td className="px-5 py-4 text-sm text-gray-700">
                    {item.score}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${item.color}`}
                    >
                      {item.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
