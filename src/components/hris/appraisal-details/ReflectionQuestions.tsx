"use client";

export interface ReflectionQuestionDef {
  questionId: string;
  title: string;
  placeholder?: string;
}

interface ReflectionQuestionsProps {
  questions?: ReflectionQuestionDef[];
  responseById?: Record<string, string>;
  onResponseChange?: (questionId: string, value: string) => void;
}

const DEFAULT_QUESTIONS: ReflectionQuestionDef[] = [
  {
    questionId: "q1",
    title: "1. What were your biggest achievements this quarter?",
    placeholder: "Describe your key achievements...",
  },
  {
    questionId: "q2",
    title: "2. What challenges did you face and how did you overcome them?",
    placeholder:
      "Describe specific obstacles and the steps you took to resolve them...",
  },
  {
    questionId: "q3",
    title: "3. What support or resources do you need from your manager?",
    placeholder:
      "Be specific about what would help you perform better in the next period...",
  },
  {
    questionId: "q4",
    title: "4. Where do you want to grow professionally in the next quarter?",
    placeholder: "Identify skills, responsibilities, or areas for development...",
  },
];

export default function ReflectionQuestions({
  questions,
  responseById = {},
  onResponseChange,
}: ReflectionQuestionsProps) {
  const isEditable = !!onResponseChange;
  const displayQuestions =
    questions && questions.length > 0
      ? questions.map((q, idx) => {
          const defaultQ =
            DEFAULT_QUESTIONS.find((dq) => dq.questionId === q.questionId) ||
            DEFAULT_QUESTIONS[idx];
          const hasGenericTitle =
            !q.title || /^question\s*\d+$/i.test(q.title.trim());
          const finalTitle =
            hasGenericTitle && defaultQ
              ? defaultQ.title
              : q.title.match(/^\d+\./)
                ? q.title
                : `${idx + 1}. ${q.title}`;
          const finalPlaceholder =
            q.placeholder || defaultQ?.placeholder || "Enter your response…";
          return {
            ...q,
            title: finalTitle,
            placeholder: finalPlaceholder,
          };
        })
      : DEFAULT_QUESTIONS;

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-slate-800 text-sm">
        Reflection Questions
      </h2>

      <div className="space-y-5">
        {displayQuestions.map((question) => {
          const answer = responseById[question.questionId] ?? "";

          return (
            <div key={question.questionId}>
              <h3 className="mb-2 text-sm font-medium text-slate-800">
                {question.title}
              </h3>

              {isEditable ? (
                <textarea
                  rows={3}
                  value={answer}
                  onChange={(e) =>
                    onResponseChange(question.questionId, e.target.value)
                  }
                  placeholder={question.placeholder || "Enter your response…"}
                  className="w-full rounded-md border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#2183C6] focus:ring-1 focus:ring-[#2183C6] resize-y min-h-[75px]"
                />
              ) : (
                <div className="rounded-md border border-dashed border-slate-200 bg-white p-3.5 text-sm text-slate-700 min-h-[48px]">
                  {answer.trim() ? answer : "No response provided."}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
