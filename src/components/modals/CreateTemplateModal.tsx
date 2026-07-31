"use client";

import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateTemplateModal({ open, onClose }: Props) {
  const [competencies, setCompetencies] = useState([{ name: "", weight: 100 }]);

  const [selfQuestions, setSelfQuestions] = useState([
    { question: "", hint: "" },
  ]);

  const [managerQuestions, setManagerQuestions] = useState([
    { question: "", hint: "" },
  ]);

  if (!open) return null;

  const addCompetency = () => {
    setCompetencies([
      ...competencies,
      {
        name: "",
        weight: 0,
      },
    ]);
  };

  const addSelfQuestion = () => {
    setSelfQuestions([
      ...selfQuestions,
      {
        question: "",
        hint: "",
      },
    ]);
  };

  const addManagerQuestion = () => {
    setManagerQuestions([
      ...managerQuestions,
      {
        question: "",
        hint: "",
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-[650px] rounded-md bg-white shadow-lg">
        {/* Header */}

        <div className="flex items-center justify-between px-7 pt-7">
          <h2 className="text-2xl font-semibold text-[#1F2937]">
            Create Template
          </h2>

          <button onClick={onClose}>
            <FiX className="text-gray-500" size={18} />
          </button>
        </div>

        {/* Body */}

        <div className="space-y-5 p-7">
          {/* Template Name */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Template Name *
            </label>

            <input
              type="text"
              placeholder="e.g. Senior Leadership Review"
              className="h-11 w-full rounded border border-gray-300 px-4 outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Description
            </label>

            <input
              type="text"
              placeholder="Brief description of when to use this template"
              className="h-11 w-full rounded border border-gray-300 px-4 outline-none focus:border-blue-500"
            />
          </div>

          {/* Competencies */}

          <div>
            <div className="mb-2 flex justify-between">
              <label className="text-sm font-medium text-gray-600">
                Competencies
              </label>

              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-green-600">
                  Total: 100% ✓
                </span>

                <button
                  onClick={addCompetency}
                  className="flex items-center gap-1 text-sm font-medium text-blue-600"
                >
                  <FiPlus size={14} />
                  Add
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {competencies.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    placeholder="Competency name"
                    className="h-11 flex-1 rounded border border-gray-300 px-4"
                  />

                  <input
                    type="number"
                    value={item.weight}
                    className="h-11 w-20 rounded border border-gray-300 px-3"
                  />

                  <button className="text-gray-400">
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Self Assessment */}

          <div>
            <div className="mb-2 flex justify-between">
              <label className="text-sm font-medium text-gray-600">
                Self-Assessment Questions
              </label>

              <button
                onClick={addSelfQuestion}
                className="flex items-center gap-1 text-sm font-medium text-blue-600"
              >
                <FiPlus size={14} />
                Add
              </button>
            </div>

            <div className="space-y-3">
              {selfQuestions.map((_, index) => (
                <div key={index}>
                  <div className="flex gap-2">
                    <input
                      placeholder={`Question ${index + 1}`}
                      className="h-11 flex-1 rounded border border-gray-300 px-4"
                    />

                    <button className="text-gray-400">
                      <FiX />
                    </button>
                  </div>

                  <input
                    placeholder="Hint text shown inside the answer field..."
                    className="mt-2 h-11 w-full rounded border border-gray-300 px-4"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Manager Questions */}

          <div>
            <div className="mb-2 flex justify-between">
              <label className="text-sm font-medium text-gray-600">
                Manager Review Questions
              </label>

              <button
                onClick={addManagerQuestion}
                className="flex items-center gap-1 text-sm font-medium text-blue-600"
              >
                <FiPlus size={14} />
                Add
              </button>
            </div>

            <div className="space-y-3">
              {managerQuestions.map((_, index) => (
                <div key={index}>
                  <div className="flex gap-2">
                    <input
                      placeholder={`Question ${index + 1}`}
                      className="h-11 flex-1 rounded border border-gray-300 px-4"
                    />

                    <button className="text-gray-400">
                      <FiX />
                    </button>
                  </div>

                  <input
                    placeholder="Hint text shown inside the answer field..."
                    className="mt-2 h-11 w-full rounded border border-gray-300 px-4"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex gap-4 px-7 pb-7">
          <button
            onClick={onClose}
            className="h-12 flex-1 rounded border border-gray-300 font-medium text-gray-700"
          >
            Cancel
          </button>

          <button className="h-12 flex-1 rounded bg-[#EDF2F7] font-medium text-gray-400">
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
