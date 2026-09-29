import type { ComponentProps } from "react";
import ProgressStep from "./ProgressStep";

const steps: Array<{
  id: string;
  title: string;
  completed: boolean;
  active: boolean;
}> = [
  {
    id: "self-assessment",
    title: "Self-Assessment",
    completed: true,
    active: false,
  },
  {
    id: "manager-review",
    title: "Manager Review",
    completed: false,
    active: true,
  },
  {
    id: "final-review",
    title: "Final Review",
    completed: false,
    active: false,
  },
  {
    id: "Hr Approved",
    title: "Hr Approved",
    completed: false,
    active: false,
  },
  {
    id: "Acknowledged",
    title: "Acknowledged",
    completed: false,
    active: false,
  },
];

export default function ReviewProgress() {
  return (
    <div className="flex items-center justify-between gap-3">
      {steps.map((step, index) => {
        const { id, ...stepProps } = step;

        return (
          <div key={id} className="flex flex-1 items-center">
            <ProgressStep {...stepProps} />

            {index < steps.length - 1 && (
              <div className="mx-3 h-[2px] flex-1 bg-gray-200">
                <div
                  className={`h-full ${
                    index === 0 ? "w-full bg-blue-600" : "bg-gray-200"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
