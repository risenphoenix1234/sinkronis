export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-border bg-white p-10 text-center">
      <div className="h2 mb-1">{title}</div>
      <p className="text-sm text-gray-500">{subtitle ?? 'No data yet'}</p>
    </div>
  )
}
