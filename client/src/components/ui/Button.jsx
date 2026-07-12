export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const base =
    'w-full rounded-md px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-accent hover:bg-accent-hover text-white shadow-sm',
    ghost:
      'bg-transparent hover:bg-surface-panel text-zinc-300 border border-border-subtle',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
