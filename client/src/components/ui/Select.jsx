export default function Select({ label, className = '', children, ...props }) {
  return (
    <label className="block text-left">
      {label && (
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500">
          {label}
        </span>
      )}
      <select
        className={`w-full appearance-none rounded-md border border-border-subtle bg-surface-raised bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%226%22 viewBox=%220 0 10 6%22><path d=%22M1 1l4 4 4-4%22 stroke=%22%2371717a%22 stroke-width=%221.5%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-no-repeat bg-[right_0.9rem_center] px-3 py-2.5 pr-9 text-sm text-zinc-100 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}
