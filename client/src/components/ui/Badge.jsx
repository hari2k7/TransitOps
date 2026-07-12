const COLORS = {
  Available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'On Trip': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'In Shop': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Retired: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  Draft: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  Dispatched: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'Off Duty': 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  Suspended: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Scheduled: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'In Progress': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

export default function Badge({ status }) {
  const classes = COLORS[status] ?? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {status}
    </span>
  )
}
