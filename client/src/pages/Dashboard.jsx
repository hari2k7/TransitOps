import { useAuth } from '../context/AuthContext.jsx'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="text-zinc-300">
      <h1 className="text-xl font-semibold text-zinc-100">
        Welcome, {user?.name}
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Dashboard KPIs and cards go here next.
      </p>
    </div>
  )
}
