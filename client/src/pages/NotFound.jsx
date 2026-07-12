import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-surface px-4 text-center">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="text-2xl font-semibold text-zinc-100">Page not found</h1>
      <p className="max-w-sm text-sm text-zinc-500">
        The page you're looking for doesn't exist or hasn't been built yet.
      </p>
      <Link
        to="/dashboard"
        className="mt-3 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
