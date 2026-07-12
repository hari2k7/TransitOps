import { useEffect, useMemo, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import {
  getMaintenanceRecords,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from '../services/maintenanceService.js'
import { getVehicles } from '../services/vehicleService.js'
import { canEdit, canAccess } from '../utils/permissions.js'
import { formatCurrency } from '../utils/currency.js'
import { MAINTENANCE_TYPES, MAINTENANCE_STATUSES } from '../utils/constants.js'
import Table from '../components/ui/Table.jsx'
import Badge from '../components/ui/Badge.jsx'
import Select from '../components/ui/Select.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Loader from '../components/ui/Loader.jsx'
import Modal from '../components/ui/Modal.jsx'
import Alert from '../components/ui/Alert.jsx'
import MaintenanceFormModal from '../components/maintenance/MaintenanceFormModal.jsx'

export default function Maintenance() {
  const { role } = useAuth()
  const { currency } = useSettings()
  const editable = canEdit(role, 'maintenance')
  const allowed = canAccess(role, 'maintenance')

  const [records, setRecords] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ type: 'All', status: 'All' })

  const [formOpen, setFormOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const loadData = () => {
    setLoading(true)
    Promise.all([getMaintenanceRecords(), getVehicles()]).then(([r, v]) => {
      setRecords(r)
      setVehicles(v)
      setLoading(false)
    })
  }

  useEffect(() => {
    if (allowed) loadData()
  }, [allowed])

  const vehicleName = (vehicleId) => {
    const v = vehicles.find((v) => v.id === Number(vehicleId))
    return v ? `${v.name} (${v.registrationNumber})` : 'Unknown vehicle'
  }

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        search.trim() === '' ||
        vehicleName(r.vehicleId).toLowerCase().includes(search.toLowerCase()) ||
        r.notes?.toLowerCase().includes(search.toLowerCase())
      const matchesType = filters.type === 'All' || r.type === filters.type
      const matchesStatus = filters.status === 'All' || r.status === filters.status
      return matchesSearch && matchesType && matchesStatus
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, vehicles, search, filters])

  const handleAdd = () => {
    setEditingRecord(null)
    setFormOpen(true)
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setFormOpen(true)
  }

  const handleFormSubmit = async (payload) => {
    if (editingRecord) {
      await updateMaintenance(editingRecord.id, payload)
    } else {
      await createMaintenance(payload)
    }
    loadData()
  }

  const handleDeleteConfirm = async () => {
    await deleteMaintenance(deleteTarget.id)
    setDeleteTarget(null)
    loadData()
  }

  const columns = [
    { key: 'vehicleId', label: 'Vehicle', render: (row) => vehicleName(row.vehicleId) },
    { key: 'type', label: 'Type' },
    { key: 'scheduledDate', label: 'Scheduled Date' },
    {
      key: 'cost',
      label: 'Cost',
      render: (row) => formatCurrency(row.cost, currency),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge status={row.status} />,
    },
    ...(editable
      ? [
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(row)}
                  className="text-xs font-medium text-accent hover:text-accent-hover"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(row)}
                  className="text-xs font-medium text-rose-400 hover:text-rose-300"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]
      : []),
  ]

  if (!allowed) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md">
          <Alert title="Access restricted">
            Your role ({role}) doesn't have access to Maintenance.
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Maintenance</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {editable
              ? 'Schedule and track vehicle service records.'
              : 'Viewing vehicle service records (read-only).'}
          </p>
        </div>
        {editable && (
          <Button onClick={handleAdd} className="flex w-auto items-center gap-1.5 px-4">
            <FiPlus size={15} /> Add Record
          </Button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search by vehicle or notes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-auto min-w-[16rem]"
        />
        <Select
          value={filters.type}
          onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
          className="w-auto min-w-[9rem]"
        >
          {MAINTENANCE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type === 'All' ? 'Type: All' : type}
            </option>
          ))}
        </Select>
        <Select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          className="w-auto min-w-[9rem]"
        >
          {MAINTENANCE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status === 'All' ? 'Status: All' : status}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading maintenance records…" />
        ) : (
          <Table columns={columns} data={filteredRecords} emptyMessage="No maintenance records found." />
        )}
      </div>

      <MaintenanceFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        record={editingRecord}
      />

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Maintenance Record"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="w-auto px-4">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="w-auto px-4 !bg-rose-600 hover:!bg-rose-700"
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-zinc-400">
          Remove this {deleteTarget?.type.toLowerCase()} record for{' '}
          <span className="text-zinc-200">
            {deleteTarget ? vehicleName(deleteTarget.vehicleId) : ''}
          </span>
          ? This can't be undone.
        </p>
      </Modal>
    </div>
  )
}
