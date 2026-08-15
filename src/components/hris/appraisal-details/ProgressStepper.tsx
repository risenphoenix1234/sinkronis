import { Check, Shield, ThumbsUp } from "lucide-react";

const steps = [
  {
    title: "Goal Setting",
    icon: Check,
    completed: true,
  },
  {
    title: "Self-Assessment",
    icon: Check,
    completed: true,
  },
  {
    title: "Manager Review",
    icon: Check,
    completed: true,
  },
  {
    title: "HR Approval",
    icon: Shield,
    active: true,
  },
  {
    title: "Acknowledgement",
    icon: ThumbsUp,
  },
];

export default function ProgressStepper() {
  return (
    <div className="rounded-xl border bg-white px-10 py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div key={step.title} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full
                  ${
                    step.completed
                      ? "bg-green-700 text-white"
                      : step.active
                        ? "bg-[#1677C8] text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Icon size={18} />
                </div>

                <span
                  className={`mt-3 text-xs font-medium ${
                    step.active
                      ? "text-[#1677C8]"
                      : step.completed
                        ? "text-green-700"
                        : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {index !== steps.length - 1 && (
                <div className="mx-5 h-[2px] flex-1 bg-green-700" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
