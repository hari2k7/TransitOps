export default function Loader({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-2.5 py-10 text-zinc-500 ${className}`}>
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-border-subtle border-t-accent"
        aria-hidden="true"
      />
      <span className="text-sm">{label}</span>
    </div>
  )
}
