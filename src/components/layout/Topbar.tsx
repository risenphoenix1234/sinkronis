'use client'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useAuth } from '@/hooks/useAuth'

export default function Topbar() {
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="w-96"><Input placeholder="Search" /></div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          {user ? `${user.email} · ${user.role.toUpperCase()}` : 'Guest'}
        </span>
        {user ? <Button variant="outline" onClick={logout}>Logout</Button> : null}
      </div>
    </header>
  )
}
