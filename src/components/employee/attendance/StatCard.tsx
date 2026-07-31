interface Props {
  title: string;
  value: number;
  color: string;
}

export default function StatCard({ title, value, color }: Props) {
  return (
    <div className="rounded-xl bg-white border p-5 flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-500">{title}</p>

        <h2 className="text-3xl font-bold mt-2">{value}</h2>
      </div>

      <div className={`w-10 h-10 rounded-lg ${color}`} />
    </div>
  );
}
