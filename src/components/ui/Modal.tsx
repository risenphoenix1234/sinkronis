'use client'
import { ReactNode } from 'react'
import Button from './Button'
export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="h2">{title}</h3>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
        {children}
      </div>
    </div>
  )
}
