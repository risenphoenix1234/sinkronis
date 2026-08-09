const questions = [
  {
    title: "1. What were your biggest achievements this quarter?",
    answer:
      "Resolved three operational bottlenecks and delivered our highest SLA compliance quarter yet.",
  },
  {
    title: "2. What challenges did you face and how did you overcome them?",
    answer:
      "Dealing with a complex vendor issue in May delayed one deliverable. Escalated and resolved within a week.",
  },
  {
    title: "3. What support or resources do you need from your manager?",
    answer:
      "More visibility into cross-department project timelines so I can plan proactively.",
  },
  {
    title: "4. Where do you want to grow professionally in the next quarter?",
    answer:
      "I want to develop my reporting skills and present operational KPIs.",
  },
];

export default function ReflectionQuestions() {
  return (
    <div className="space-y-6">
      <h2 className="font-semibold">Reflection Questions</h2>

      {questions.map((question) => (
        <div key={question.title}>
          <h3 className="mb-2 font-medium">{question.title}</h3>

          <div className="rounded border bg-white p-4 text-sm text-slate-600">
            {question.answer}
          </div>
        </div>
      ))}
    </div>
  );
}
