interface Props {
  score: number;
}

export default function ScoreCircle({ score }: Props) {
  return (
    <div className="flex h-36 w-36 items-center justify-center rounded-full border-8 border-blue-500 bg-white shadow">
      <div className="text-center">
        <p className="text-4xl font-bold text-slate-800">{score}</p>

        <span className="text-sm text-slate-500">%</span>
      </div>
    </div>
  );
}
