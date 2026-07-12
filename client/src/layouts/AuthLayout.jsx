const FEATURES = [
  'Real-time dispatch across your entire fleet',
  'Automatic vehicle & driver status transitions',
  'Role-based access for every team',
  'Fuel, maintenance & cost tracking in one place',
]

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-svh w-full flex-col lg:flex-row">
      {/* Decorative side panel — hidden on small screens */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-[42%] lg:flex-col lg:justify-between bg-gradient-to-br from-zinc-900 via-surface to-black p-10 xl:p-14">
        {/* Decorative route map */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
          viewBox="0 0 500 800"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M-20 620 C 100 560, 140 460, 90 380 S 40 200, 180 160 S 420 140, 460 40"
            stroke="url(#routeGradient)"
            strokeWidth="2"
            strokeDasharray="6 10"
          />
          <path
            d="M-40 120 C 60 180, 120 120, 220 220 S 300 420, 480 460"
            stroke="#3f3f46"
            strokeWidth="1.5"
            strokeDasharray="3 8"
          />
          <circle cx="90" cy="380" r="4" fill="#d97706" />
          <circle cx="180" cy="160" r="3" fill="#71717a" />
          <circle cx="460" cy="40" r="4" fill="#d97706" />
          <circle cx="220" cy="220" r="3" fill="#71717a" />
          <circle cx="480" cy="460" r="4" fill="#d97706" />
          <defs>
            <linearGradient id="routeGradient" x1="0" y1="0" x2="500" y2="800">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#52525b" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/15 text-accent">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="1" y="6" width="15" height="12" rx="2" />
              <path d="M16 10h4l3 3v5h-7" />
              <circle cx="6" cy="20" r="2" />
              <circle cx="18" cy="20" r="2" />
            </svg>
          </div>
          <span className="text-sm font-medium text-zinc-300">TransitOps</span>
        </div>

        <div className="relative">
          <h2 className="max-w-xs text-3xl font-semibold leading-tight text-white xl:text-4xl">
            Run your fleet without the spreadsheet chaos
          </h2>
          <ul className="mt-8 space-y-3.5">
            {FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 text-sm text-zinc-400"
              >
                <svg
                  className="mt-0.5 h-4 w-4 flex-none text-accent"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-zinc-600">
          TransitOps &copy; 2026 &middot; RBAC enabled
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-surface px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          {/* Mobile-only compact brand mark */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="h-7 w-7 rounded-md bg-accent/15" aria-hidden="true" />
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
