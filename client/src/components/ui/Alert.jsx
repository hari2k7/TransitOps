const VARIANTS = {
  error: {
    wrapper: 'border-red-500/40 bg-red-500/10',
    title: 'text-red-400',
    body: 'text-red-300/90',
    icon: '⚠',
  },
  success: {
    wrapper: 'border-emerald-500/40 bg-emerald-500/10',
    title: 'text-emerald-400',
    body: 'text-emerald-300/90',
    icon: '✓',
  },
}

export default function Alert({ title, children, variant = 'error' }) {
  const styles = VARIANTS[variant] ?? VARIANTS.error

  return (
    <div className={`rounded-md border px-4 py-3 text-left ${styles.wrapper}`}>
      {title && (
        <p className={`mb-1 flex items-center gap-1.5 text-sm font-medium ${styles.title}`}>
          <span aria-hidden="true">{styles.icon}</span> {title}
        </p>
      )}
      <div className={`text-xs leading-relaxed ${styles.body}`}>{children}</div>
    </div>
  )
}
