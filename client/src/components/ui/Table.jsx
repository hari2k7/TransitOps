export default function Table({ columns, data, emptyMessage = 'No records found.' }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-subtle">
      <table className="w-full min-w-max text-left text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-raised">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-zinc-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row.id ?? i}
                className="border-b border-border-subtle last:border-0 hover:bg-surface-panel"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-zinc-300">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
