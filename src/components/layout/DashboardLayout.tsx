import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="min-h-screen flex-1">
        <Topbar />
        <main className="mx-auto w-full max-w-7xl p-6">{children}</main>
      </div>
    </div>
  )
}
