'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import type { Role } from '@/types/auth'

export default function Login() {
  const sp = useSearchParams()
  const suggest = (sp.get('role') as Role) || 'hr'
  const router = useRouter()
  const { loginAs } = useAuth()

  async function handle(role: Role) {
    await loginAs(role)
    router.push(`/${role}${role==='account' ? '/dashboard' : role==='ceo' ? '/profile' : '/overview'}`)
  }

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="card w-full max-w-md p-8">
        <h1 className="h1 mb-6">Sign in</h1>
        <div className="space-y-3">
          <Input placeholder="Email" />
          <Input placeholder="Password" type="password" />
          <Button className="w-full" onClick={() => handle(suggest)}>Continue as {suggest.toUpperCase()}</Button>
          <div className="grid grid-cols-2 gap-2">
            {(['ceo','hr','hod','employee','payroll','account'] as Role[]).map(r =>
              <Button key={r} variant="outline" onClick={() => handle(r)} className="capitalize">{r}</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
