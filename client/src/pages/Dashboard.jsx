import { useAuth } from '../context/AuthContext.jsx'

export default function Dashboard() {
  const { user, role, logout } = useAuth()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-surface px-4 text-center text-zinc-300">
      <p className="text-lg font-medium text-zinc-100">
        Welcome, {user?.name}
      </p>
      <p className="text-sm text-zinc-500">
        Logged in as {role} &middot; Dashboard content coming next
      </p>
      <button
        onClick={logout}
        className="mt-2 rounded-md border border-border-subtle px-4 py-2 text-sm text-zinc-400 hover:bg-surface-panel"
      >
        Log out
      </button>
    </div>
  )
}
