import { Outlet } from 'react-router-dom'
import Topbar from '../components/layout/Topbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function DashboardLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-svh bg-surface">
      <Topbar user={user} onLogout={logout} />
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
