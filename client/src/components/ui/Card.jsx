export default function Card({ title, value, subtext, className = '', children }) {
  if (children) {
    return (
      <div
        className={`rounded-xl border border-border-subtle bg-surface-raised p-5 ${className}`}
      >
        {children}
      </div>
    )
  }

  return (
    <div className={`rounded-xl border border-border-subtle bg-surface-raised p-5 ${className}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {title}
      </p>
      <p className="mt-2 text-2xl font-semibold text-zinc-100">{value}</p>
      {subtext && <p className="mt-1 text-xs text-zinc-500">{subtext}</p>}
    </div>
  )
}
