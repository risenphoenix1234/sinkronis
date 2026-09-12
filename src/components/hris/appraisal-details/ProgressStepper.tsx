import { AppraisalStatus, WORKFLOW_STEPS } from "@/lib/api/types/hrisTypes";
import {
  Check,
  Target,
  ClipboardList,
  Shield,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react";

interface ProgressStepperProps {
  currentStatus: AppraisalStatus;
}

const STEP_CONFIG = {
  GOAL_SETTING: { title: "Goal Setting", icon: Target },
  SELF_ASSESSMENT: { title: "Self-Assessment", icon: ClipboardList },
  MANAGER_REVIEW: { title: "Manager Review", icon: Check },
  PENDING_HR_APPROVAL: { title: "HR Approval", icon: Shield },
  ACKNOWLEDGEMENT: { title: "Acknowledgement", icon: ThumbsUp },
} satisfies Record<
  (typeof WORKFLOW_STEPS)[number],
  { title: string; icon: LucideIcon }
>;

export default function ProgressStepper({
  currentStatus,
}: ProgressStepperProps) {
  const currentIndex =
    currentStatus === "COMPLETED"
      ? WORKFLOW_STEPS.length
      : WORKFLOW_STEPS.indexOf(currentStatus);

  return (
    <div className="rounded-xl border bg-white px-10 py-8">
      <div className="flex items-center justify-between">
        {WORKFLOW_STEPS.map((statusKey, index) => {
          const { title, icon: Icon } = STEP_CONFIG[statusKey];
          const completed = index < currentIndex;
          const active = index === currentIndex;

          return (
            <div key={statusKey} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full
                  ${
                    completed
                      ? "bg-green-700 text-white"
                      : active
                        ? "bg-[#1677C8] text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Icon size={18} />
                </div>

                <span
                  className={`mt-3 text-xs font-medium ${
                    active
                      ? "text-[#1677C8]"
                      : completed
                        ? "text-green-700"
                        : "text-gray-400"
                  }`}
                >
                  {title}
                </span>
              </div>

              {index !== WORKFLOW_STEPS.length - 1 && (
                <div
                  className={`mx-5 h-[2px] flex-1 ${
                    completed ? "bg-green-700" : "bg-gray-200"
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
