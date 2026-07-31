"use client";

import { Objective } from "@/types/employee/appraisal";
import { MessageSquare } from "lucide-react";

interface Props {
  objective: Objective;
}

export default function ObjectiveRow({ objective }: Props) {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-6 py-5">
        <h3 className="font-semibold text-gray-800">{objective.title}</h3>

        <p className="mt-1 text-xs text-gray-500">{objective.description}</p>
      </td>

      <td className="px-6">{objective.weight}%</td>

      <td className="px-6">{objective.target}</td>

      <td className="px-6">
        <textarea
          rows={2}
          placeholder="Enter achievement..."
          className="w-full rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-blue-500"
        />
      </td>

      <td className="px-6">
        <input
          type="number"
          className="h-10 w-20 rounded-lg border border-gray-300 text-center"
        />
      </td>

      <td className="px-6">
        <input
          type="number"
          className="h-10 w-20 rounded-lg border border-gray-300 text-center"
        />
      </td>

      <td className="px-6">
        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">
          <MessageSquare size={16} />
          Comment
        </button>
      </td>
    </tr>
  );
}
