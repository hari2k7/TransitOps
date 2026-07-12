import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#22c55e', '#0ea5e9', '#f59e0b', '#71717a']

export default function FleetStatusChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-raised p-5">
      <p className="text-sm font-medium text-zinc-200">Fleet Status Breakdown</p>
      <p className="mt-0.5 text-xs text-zinc-500">
        {total} vehicles across all statuses
      </p>

      <div className="mt-2 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#1c1c21',
                border: '1px solid #2a2a31',
                borderRadius: 8,
                fontSize: 12,
                color: '#e4e4e7',
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: '#a1a1aa' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
