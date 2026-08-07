import Card from "./Card";

interface Props {
  title: string;
  value: string;
  subtitle?: string;
}

export default function SummaryCard({ title, value, subtitle }: Props) {
  return (
    <Card className="p-6">
      <p className="text-sm text-slate-500">{title}</p>

      <h2 className="mt-2 text-3xl font-bold text-slate-800">{value}</h2>

      {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
    </Card>
  );
}
