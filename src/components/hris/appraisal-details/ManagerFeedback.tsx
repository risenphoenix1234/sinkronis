import {
  MessageSquareText,
  TrendingUp,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

interface FeedbackCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function FeedbackCard({ title, icon, children }: FeedbackCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF6FF]">
          {icon}
        </div>

        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}

export default function ManagerFeedback() {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-[#F8FAFC]">
      {/* Section header */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF4FF]">
            <MessageSquareText size={18} className="text-[#1677C8]" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">Manager Feedback</h2>

            <p className="mt-1 text-xs text-slate-400">
              Overall feedback from the manager
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Overall feedback */}
        <FeedbackCard
          title="Overall Performance Comments"
          icon={<MessageSquareText size={18} className="text-[#1677C8]" />}
        >
          <p className="text-sm leading-7 text-slate-600">
            Tunde demonstrated a strong commitment to improving operational
            efficiency throughout the quarter. He successfully identified and
            resolved several process bottlenecks and contributed positively to
            cross-functional initiatives.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            While some targets were not fully achieved, there was measurable
            progress across the majority of operational objectives. Continued
            focus on planning, stakeholder engagement, and timely delivery will
            help improve performance in the next quarter.
          </p>
        </FeedbackCard>

        {/* Two-column feedback */}
        <div className="grid gap-6 lg:grid-cols-2">
          <FeedbackCard
            title="Key Strengths"
            icon={<TrendingUp size={18} className="text-green-600" />}
          >
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm leading-6 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />

                <span>
                  Strong ownership of operational improvement initiatives.
                </span>
              </li>

              <li className="flex gap-3 text-sm leading-6 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />

                <span>Good collaboration with cross-functional teams.</span>
              </li>

              <li className="flex gap-3 text-sm leading-6 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />

                <span>
                  Demonstrates initiative when identifying process
                  inefficiencies.
                </span>
              </li>

              <li className="flex gap-3 text-sm leading-6 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />

                <span>Maintains a positive and supportive attitude.</span>
              </li>
            </ul>
          </FeedbackCard>

          <FeedbackCard
            title="Development Areas"
            icon={<AlertCircle size={18} className="text-[#A16207]" />}
          >
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm leading-6 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A16207]" />

                <span>Improve consistency in meeting quarterly targets.</span>
              </li>

              <li className="flex gap-3 text-sm leading-6 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A16207]" />

                <span>Improve prioritisation of high-impact activities.</span>
              </li>

              <li className="flex gap-3 text-sm leading-6 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A16207]" />

                <span>Increase proactive stakeholder follow-up.</span>
              </li>

              <li className="flex gap-3 text-sm leading-6 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A16207]" />

                <span>Delegate more effectively across the team.</span>
              </li>
            </ul>
          </FeedbackCard>
        </div>

        {/* Development plan */}
        <FeedbackCard
          title="Recommended Development Focus"
          icon={<Lightbulb size={18} className="text-[#7B22A8]" />}
        >
          <div className="rounded-lg border border-purple-100 bg-purple-50 p-5">
            <h4 className="text-sm font-semibold text-[#7B22A8]">
              Next Quarter Focus
            </h4>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Focus on improving project planning and reporting capabilities
              while taking greater ownership of cross-functional initiatives.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-4">
                <p className="text-xs font-medium text-slate-400">
                  Development Area
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-700">
                  Reporting & Analytics
                </p>
              </div>

              <div className="rounded-lg bg-white p-4">
                <p className="text-xs font-medium text-slate-400">
                  Recommended Action
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-700">
                  KPI reporting training
                </p>
              </div>

              <div className="rounded-lg bg-white p-4">
                <p className="text-xs font-medium text-slate-400">Target</p>

                <p className="mt-2 text-sm font-semibold text-slate-700">
                  Q3 2026
                </p>
              </div>
            </div>
          </div>
        </FeedbackCard>
      </div>
    </section>
  );
}
