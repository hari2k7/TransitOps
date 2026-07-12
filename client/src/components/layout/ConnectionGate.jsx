import { Link, useLocation } from 'react-router-dom'
import { FiWifiOff, FiServer } from 'react-icons/fi'
import { useConnectionStatus, CONNECTION_MESSAGES } from '../../hooks/useConnectionStatus.js'
import Button from '../ui/Button.jsx'

const ICONS = {
  offline: FiWifiOff,
  'server-unreachable': FiServer,
}

// Wraps the module pages inside DashboardLayout. Blocks everything except
// Settings while offline/unreachable — Settings is pure localStorage, no
// API calls, so it's the one page that still works without a connection.
export default function ConnectionGate({ children }) {
  const { status, checkNow } = useConnectionStatus()
  const location = useLocation()

  const isBlocked = status === 'offline' || status === 'server-unreachable'
  const isSettingsRoute = location.pathname === '/settings'

  if (!isBlocked || isSettingsRoute) {
    return children
  }

  const Icon = ICONS[status]
  const { title, message } = CONNECTION_MESSAGES[status]

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <Icon size={26} />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-zinc-100">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">{message}</p>

        <div className="mt-6 flex flex-col items-center gap-3">
          <Button onClick={checkNow} className="w-full max-w-[12rem]">
            Try again
          </Button>
          <Link to="/settings" className="text-sm text-zinc-500 hover:text-zinc-300 hover:underline">
            Settings is still available
          </Link>
        </div>
      </div>
    </div>
  )
}
