
'use client'
export function StatCard({ title, value, hint }: { title: string; value: string | number; hint?: string }) {
  return (
    <div className="card p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-green-600">{hint}</div>}
    </div>
  )
}
