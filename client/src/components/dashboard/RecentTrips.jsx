import Table from '../ui/Table.jsx'
import Badge from '../ui/Badge.jsx'

const columns = [
  { key: 'id', label: 'Trip ID' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'driver', label: 'Driver' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <Badge status={row.status} />,
  },
  { key: 'eta', label: 'ETA' },
]

export default function RecentTrips({ trips }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-raised p-5">
      <p className="text-sm font-medium text-zinc-200">Recent Trips</p>
      <p className="mt-0.5 text-xs text-zinc-500">
        Latest dispatch activity across the fleet
      </p>

      <div className="mt-4">
        <Table columns={columns} data={trips} emptyMessage="No trips yet." />
      </div>
    </div>
  )
}
