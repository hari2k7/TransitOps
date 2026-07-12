export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-svh w-full flex-col lg:flex-row">
      {/* Decorative side panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-[38%] lg:flex-col lg:justify-between bg-zinc-100 p-10 xl:p-14">
        <div className="h-9 w-9 rounded-md bg-zinc-300" aria-hidden="true" />

        <div>
          <p className="text-xl font-semibold text-zinc-900">TransitOps</p>
          <p className="mt-1 text-sm text-zinc-500">
            Smart Transport Operations Platform
          </p>
        </div>

        <p className="text-xs text-zinc-400">
          TRANSITOPS &copy; 2026 &middot; RBAC ENABLED
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-surface px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          {/* Mobile-only compact brand mark */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="h-7 w-7 rounded-md bg-zinc-700" aria-hidden="true" />
            <span className="text-sm font-semibold text-zinc-200">
              TransitOps
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
