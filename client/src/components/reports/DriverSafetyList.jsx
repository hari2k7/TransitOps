const BAND_COLORS = {
  Excellent: '#22c55e',
  Good: '#0ea5e9',
  Fair: '#f59e0b',
  'Needs Attention': '#f43f5e',
}

export default function DriverSafetyList({ drivers }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-raised p-5">
      <p className="text-sm font-medium text-zinc-200">Driver Safety Scores</p>
      <p className="mt-0.5 text-xs text-zinc-500">Ranked, highest first</p>

      <div className="mt-4 space-y-3.5">
        {drivers.map((d) => (
          <div key={d.name}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-300">{d.name}</span>
              <span className="text-zinc-500">
                {d.score} <span style={{ color: BAND_COLORS[d.band] }}>· {d.band}</span>
              </span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-panel">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${d.score}%`, backgroundColor: BAND_COLORS[d.band] }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
