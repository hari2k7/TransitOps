const THEMES = {
  accent: {
    ring: 'from-accent/25 via-accent/5 to-transparent',
    icon: 'bg-accent/15 text-accent',
    glow: 'group-hover:shadow-accent/10',
  },
  emerald: {
    ring: 'from-emerald-500/25 via-emerald-500/5 to-transparent',
    icon: 'bg-emerald-500/15 text-emerald-400',
    glow: 'group-hover:shadow-emerald-500/10',
  },
  sky: {
    ring: 'from-sky-500/25 via-sky-500/5 to-transparent',
    icon: 'bg-sky-500/15 text-sky-400',
    glow: 'group-hover:shadow-sky-500/10',
  },
  violet: {
    ring: 'from-violet-500/25 via-violet-500/5 to-transparent',
    icon: 'bg-violet-500/15 text-violet-400',
    glow: 'group-hover:shadow-violet-500/10',
  },
  rose: {
    ring: 'from-rose-500/25 via-rose-500/5 to-transparent',
    icon: 'bg-rose-500/15 text-rose-400',
    glow: 'group-hover:shadow-rose-500/10',
  },
}

export default function StatCard({ label, value, hint, icon: Icon, accent = 'accent' }) {
  const theme = THEMES[accent]

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-raised p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${theme.glow}`}
    >
      {/* Soft radial glow in the corner */}
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${theme.ring} blur-xl transition-opacity duration-200 group-hover:opacity-100`}
      />

      {/* Oversized watermark icon */}
      {Icon && (
        <Icon
          size={72}
          className="pointer-events-none absolute -right-3 -bottom-3 text-zinc-100/[0.03]"
        />
      )}

      <div className="relative">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${theme.icon}`}>
              <Icon size={16} />
            </span>
          )}
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
        </div>

        <p className="mt-4 text-3xl font-semibold tracking-tight text-zinc-100">{value}</p>
        {hint && <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>}
      </div>
    </div>
  )
}
