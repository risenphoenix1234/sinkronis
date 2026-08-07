"use client";

import { useState } from "react";
import Card from "./Card";
import TextArea from "./TextArea";
import CharacterCounter from "./CharacterCounter";

interface Props {
  title: string;
  description?: string;
  defaultValue?: string;
}

export default function ReflectionCard({
  title,
  description,
  defaultValue = "",
}: Props) {
  const [answer, setAnswer] = useState(defaultValue);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>

      {description && (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      )}

      <div className="mt-5">
        <TextArea
          rows={6}
          placeholder="Type your response here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <CharacterCounter current={answer.length} />
      </div>
    </Card>
  );
}
