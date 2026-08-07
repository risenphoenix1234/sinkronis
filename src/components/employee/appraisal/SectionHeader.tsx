interface Props {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, action }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 pt-4 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{title}</h2>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>

        {action}
      </div>
    </div>
  );
}
