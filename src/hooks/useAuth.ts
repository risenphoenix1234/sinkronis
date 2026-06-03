'use client'
import { useAtom } from 'jotai'
import { userAtom } from '@/store/auth.store'
import { mockLogin, mockLogout } from '@/services/auth.service'
import type { Role } from '@/types/auth'

export function useAuth() {
  const [user, setUser] = useAtom(userAtom)
  return {
    user,
    loginAs: async (role: Role) => setUser(await mockLogin(role)),
    logout: async () => { await mockLogout(); setUser(null) },
  }
}
