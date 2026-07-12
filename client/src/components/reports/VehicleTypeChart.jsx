import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

const COLORS = ['#d97706', '#0ea5e9', '#8b5cf6', '#22c55e']

export default function VehicleTypeChart({ data }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-raised p-5">
      <p className="text-sm font-medium text-zinc-200">Fleet Composition</p>
      <p className="mt-0.5 text-xs text-zinc-500">Vehicles grouped by type</p>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a31" vertical={false} />
            <XAxis dataKey="type" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={{ stroke: '#2a2a31' }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
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
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry, i) => (
                <Cell key={entry.type} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
