"use client";

import { useState } from "react";
import { Plus, X, GripVertical, Trash2 } from "lucide-react";

interface Competency {
  id: string;
  title: string;
  weight: number;
}

interface Question {
  id: string;
  question: string;
  placeholder: string;
}

interface EditTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditTemplateModal({
  isOpen,
  onClose,
}: EditTemplateModalProps) {
  const [templateName, setTemplateName] = useState(
    "Standard Performance Review",
  );

  const [description, setDescription] = useState(
    "General-purpose template suitable for all roles.",
  );

  const [competencies, setCompetencies] = useState<Competency[]>([
    {
      id: "1",
      title: "Job Knowledge & Technical Skills",
      weight: 25,
    },
    {
      id: "2",
      title: "Quality of Work & Delivery",
      weight: 20,
    },
    {
      id: "3",
      title: "Communication & Collaboration",
      weight: 20,
    },
    {
      id: "4",
      title: "Initiative & Problem Solving",
      weight: 15,
    },
    {
      id: "5",
      title: "Attendance & Reliability",
      weight: 10,
    },
    {
      id: "6",
      title: "Leadership & Growth Mindset",
      weight: 10,
    },
  ]);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "What were your biggest achievements this quarter?",
      placeholder:
        "Describe your key accomplishments and their impact on the team or organisation...",
    },
    {
      id: "2",
      question: "What challenges did you face and how did you overcome them?",
      placeholder:
        "Describe specific challenges and actions taken to resolve them...",
    },
  ]);

  const totalWeight = competencies.reduce((sum, item) => sum + item.weight, 0);

  const removeCompetency = (id: string) => {
    setCompetencies((prev) => prev.filter((item) => item.id !== id));
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((item) => item.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}

      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      {/* Modal */}

      <div className="relative z-10 flex h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-md bg-white shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-2xl font-semibold text-slate-800">
            Edit Template
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scroll Content */}

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Template Name */}

          <div className="mb-5">
            <label className="mb-2 block text-sm text-slate-600">
              Template Name *
            </label>

            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}

          <div className="mb-6">
            <label className="mb-2 block text-sm text-slate-600">
              Description
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Competencies */}

          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-800">Competencies</h3>
              </div>

              <div className="flex items-center gap-5">
                <span className="text-sm font-medium text-green-600">
                  Total: {totalWeight}%
                </span>

                <button className="flex items-center gap-1 text-sm font-medium text-blue-600">
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {competencies.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    value={item.title}
                    className="h-11 flex-1 rounded-md border border-slate-300 px-3 text-sm"
                    readOnly
                  />

                  <input
                    value={item.weight}
                    className="h-11 w-20 rounded-md border border-slate-300 text-center text-sm"
                    readOnly
                  />

                  <button className="text-slate-400">
                    <GripVertical size={16} />
                  </button>

                  <button
                    onClick={() => removeCompetency(item.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Questions */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-medium text-slate-800">
                Self-Assessment Questions
              </h3>

              <button className="flex items-center gap-1 text-sm font-medium text-blue-600">
                <Plus size={14} />
                Add
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((item) => (
                <div key={item.id}>
                  <div className="mb-2 flex items-center gap-2">
                    <input
                      value={item.question}
                      readOnly
                      className="h-11 flex-1 rounded-md border border-slate-300 px-3 text-sm"
                    />

                    <button
                      onClick={() => removeQuestion(item.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <textarea
                    value={item.placeholder}
                    readOnly
                    rows={2}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            Cancel
          </button>

          <button className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
