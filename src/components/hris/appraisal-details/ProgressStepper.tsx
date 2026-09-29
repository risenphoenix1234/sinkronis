import { AppraisalStatus, WORKFLOW_STEPS } from "@/lib/api/types/hrisTypes";
import {
  Target,
  FileText,
  User,
  Shield,
  ThumbsUp,
  Check,
  type LucideIcon,
} from "lucide-react";

interface ProgressStepperProps {
  currentStatus: AppraisalStatus;
}

const STEP_CONFIG = {
  GOAL_SETTING: { title: "Goal Setting", icon: Target },
  SELF_ASSESSMENT: { title: "Self-Assessment", icon: FileText },
  MANAGER_REVIEW: { title: "Manager Review", icon: User },
  PENDING_HR_APPROVAL: { title: "HR Approval", icon: Shield },
  ACKNOWLEDGEMENT: { title: "Acknowledgment", icon: ThumbsUp },
} satisfies Record<
  (typeof WORKFLOW_STEPS)[number],
  { title: string; icon: LucideIcon }
>;

export default function ProgressStepper({
  currentStatus,
}: ProgressStepperProps) {
  const normalizedStatus =
    (currentStatus as string) === "ACKNOWLEDGMENT"
      ? "ACKNOWLEDGEMENT"
      : currentStatus;
  const currentIndex =
    normalizedStatus === "COMPLETED" ||
    (normalizedStatus as string) === "ACKNOWLEDGED"
      ? WORKFLOW_STEPS.length
      : WORKFLOW_STEPS.indexOf(normalizedStatus as (typeof WORKFLOW_STEPS)[number]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-8 py-6 shadow-xs">
      <div className="flex items-center justify-between">
        {WORKFLOW_STEPS.map((statusKey, index) => {
          const { title, icon: Icon } = STEP_CONFIG[statusKey];
          const completed = index < currentIndex;
          const active = index === currentIndex;

          return (
            <div key={statusKey} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    completed
                      ? "bg-[#10753E] text-white"
                      : active
                        ? "bg-[#1677C8] text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {completed ? (
                    <Check size={18} strokeWidth={2.5} />
                  ) : (
                    <Icon size={18} />
                  )}
                </div>

                <span
                  className={`mt-3 text-xs font-medium ${
                    active
                      ? "text-[#1677C8]"
                      : completed
                        ? "text-[#10753E]"
                        : "text-gray-400"
                  }`}
                >
                  {title}
                </span>
              </div>

              {index !== WORKFLOW_STEPS.length - 1 && (
                <div
                  className={`mx-5 h-[2px] flex-1 ${
                    completed ? "bg-[#10753E]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
