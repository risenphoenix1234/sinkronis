interface Props {
  current: number;
  limit?: number;
}

export default function CharacterCounter({ current, limit = 500 }: Props) {
  return (
    <p
      className={`mt-2 text-right text-xs ${
        current > limit ? "text-red-600" : "text-slate-400"
      }`}
    >
      {current}/{limit}
    </p>
  );
}
