export default function Input({ label, className = '', ...props }) {
  return (
    <label className="block text-left">
      {label && (
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500">
          {label}
        </span>
      )}
      <input
        className={`w-full rounded-md border border-border-subtle bg-surface-raised px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent ${className}`}
        {...props}
      />
    </label>
  )
}
