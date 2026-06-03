import type { Role, User } from '@/types/auth'

const demoUsers: Record<Role, User & { id?: string; name?: string }> = {
  ceo: { email: 'ceo@sinkronis.local', role: 'ceo' },
  hr: { email: 'hr@sinkronis.local', role: 'hr' },
  hod: { email: 'hod@sinkronis.local', role: 'hod' },
  employee: { email: 'emp@sinkronis.local', role: 'employee' },
  payroll: { email: 'payroll@sinkronis.local', role: 'payroll' },
  account: { email: 'acc@sinkronis.local', role: 'account' },
}

export async function mockLogin(role: Role): Promise<User> {
  await new Promise(r => setTimeout(r, 300))
  return demoUsers[role]
}
export async function mockLogout(): Promise<void> {
  await new Promise(r => setTimeout(r, 150))
}
