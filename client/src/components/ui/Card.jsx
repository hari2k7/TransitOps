export default function Card({
  title,
  value,
  subtext,
  icon: Icon,
  accent = 'accent',
  className = '',
  children,
}) {
  if (children) {
    return (
      <div
        className={`rounded-xl border border-border-subtle bg-surface-raised p-5 ${className}`}
      >
        {children}
      </div>
    )
  }

  const accentClasses = {
    accent: 'bg-accent/10 text-accent',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    sky: 'bg-sky-500/10 text-sky-400',
    rose: 'bg-rose-500/10 text-rose-400',
    violet: 'bg-violet-500/10 text-violet-400',
  }

  return (
    <div
      className={`group rounded-xl border border-border-subtle bg-surface-raised p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20 ${className}`}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {title}
        </p>
        {Icon && (
          <span
            className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg ${accentClasses[accent]}`}
          >
            <Icon size={16} />
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100">
        {value}
      </p>
      {subtext && <p className="mt-1 text-xs text-zinc-500">{subtext}</p>}
    </div>
  )
}
