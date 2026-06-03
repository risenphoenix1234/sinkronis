// src/app/layout.tsx
import './globals.css'
import QueryProvider from '@/providers/QueryProvider'
import AuthProvider from '@/providers/AuthProvider'

export const metadata = { title: 'Sinkronis', description: 'Static prototype' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
