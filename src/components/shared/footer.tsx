import React from "react";

export const footer = () => {
  return (
    <div className="border-t border-dashed border-gray-300 mt-8">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-end gap-3">
        <button className="px-5 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
          Cancel
        </button>
        <button className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition shadow-sm">
          Next
        </button>
      </div>
    </div>
  );
};

export default footer;
