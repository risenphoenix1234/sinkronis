import type { User } from '@/types/auth'

export async function getUsers(): Promise<User[]> {
  return [
    { email: 'ada@company.com', role: 'employee' },
    { email: 'tunde@company.com', role: 'ceo' },
  ]
}
