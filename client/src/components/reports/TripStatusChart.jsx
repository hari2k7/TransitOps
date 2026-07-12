import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const STATUS_COLORS = {
  Draft: '#71717a',
  Dispatched: '#0ea5e9',
  Completed: '#22c55e',
  Cancelled: '#f43f5e',
}

export default function TripStatusChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.count, 0)

  // Reshape [{status, count}] into a single stacked-bar row: { name, Draft, Dispatched, ... }
  const row = { name: 'Trips' }
  data.forEach((d) => {
    row[d.status] = d.count
  })

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-raised p-5">
      <p className="text-sm font-medium text-zinc-200">Trip Status Mix</p>
      <p className="mt-0.5 text-xs text-zinc-500">{total} trips across the lifecycle</p>

      <div className="mt-6 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[row]} layout="vertical" margin={{ left: -30 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              cursor={{ fill: '#ffffff08' }}
              contentStyle={{
                background: '#1c1c21',
                border: '1px solid #2a2a31',
                borderRadius: 8,
                fontSize: 12,
                color: '#e4e4e7',
              }}
            />
            {Object.keys(STATUS_COLORS).map((status, i, arr) => (
              <Bar
                key={status}
                dataKey={status}
                stackId="a"
                fill={STATUS_COLORS[status]}
                radius={
                  i === 0
                    ? [6, 0, 0, 6]
                    : i === arr.length - 1
                      ? [0, 6, 6, 0]
                      : [0, 0, 0, 0]
                }
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {data.map((d) => (
          <div key={d.status} className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[d.status] }}
            />
            {d.status} · {d.count}
          </div>
        ))}
      </div>
    </div>
  )
}
