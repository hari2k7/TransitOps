import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts'

export default function UtilizationGauge({ pct, label = 'Fleet Utilization' }) {
  const data = [{ name: label, value: pct, fill: '#d97706' }]

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-raised p-5">
      <p className="text-sm font-medium text-zinc-200">{label}</p>
      <p className="mt-0.5 text-xs text-zinc-500">Vehicles currently on trip vs. total fleet</p>

      <div className="relative mt-2 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            barSize={16}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: '#2a2a31' }}
              dataKey="value"
              cornerRadius={8}
              angleAxisId={0}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold text-zinc-100">{pct}%</span>
          <span className="mt-1 text-xs text-zinc-500">utilized</span>
        </div>
      </div>
    </div>
  )
}
