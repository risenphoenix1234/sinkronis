import ReflectionCard from "./ReflectionCard";
import ReflectionSection from "./ReflectionSection";

import { ReflectionQuestion } from "@/types/employee/appraisal";

interface Props {
  questions: ReflectionQuestion[];
}

export default function ReflectionQuestions({ questions }: Props) {
  return (
    <section className="space-y-6 bg-white p-4">
      <ReflectionSection />

      {questions.map((question) => (
        <ReflectionCard
          key={question.id}
          title={question.title}
          description={question.description}
          defaultValue={question.answer}
        />
      ))}
    </section>
  );
}
