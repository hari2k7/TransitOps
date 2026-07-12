export default function Alert({ title, children }) {
  return (
    <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-left">
      {title && (
        <p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-red-400">
          <span aria-hidden="true">⚠</span> {title}
        </p>
      )}
      <div className="text-xs leading-relaxed text-red-300/90">{children}</div>
    </div>
  )
}
