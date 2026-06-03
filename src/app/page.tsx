import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="card w-full max-w-xl p-8 text-center">
        <h1 className="h1 mb-2">Sinkronis Prototype</h1>
        <p className="mb-6 text-gray-600">Pick a role to explore dashboards. Static only, no APIs.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {['ceo','hr','hod','employee','payroll','account'].map(r => (
            <Link key={r} href={`/login?role=${r}`}>
              <Button className="w-full capitalize" variant="outline">{r}</Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
