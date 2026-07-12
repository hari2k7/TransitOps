import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useSettings } from '../../context/SettingsContext.jsx'
import { formatCurrency, currencySymbol } from '../../utils/currency.js'

export default function MaintenanceCostChart({ data }) {
  const { currency } = useSettings()

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-raised p-5">
      <p className="text-sm font-medium text-zinc-200">Maintenance Spend by Type</p>
      <p className="mt-0.5 text-xs text-zinc-500">Cumulative cost across service categories</p>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a31" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${currencySymbol(currency)}${v / 1000}k`}
            />
            <YAxis
              type="category"
              dataKey="type"
              width={110}
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: '#ffffff08' }}
              formatter={(v) => formatCurrency(v, currency)}
              contentStyle={{
                background: '#1c1c21',
                border: '1px solid #2a2a31',
                borderRadius: 8,
                fontSize: 12,
                color: '#e4e4e7',
              }}
            />
            <Bar dataKey="cost" fill="#d97706" radius={[0, 6, 6, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
