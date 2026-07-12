import { useEffect, useMemo, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext.jsx'
import { usePolling } from '../hooks/usePolling.js'
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../services/vehicleService.js'
import { canEdit, canAccess } from '../utils/permissions.js'
import { VEHICLE_TYPES, VEHICLE_STATUSES, REGIONS } from '../utils/constants.js'
import Table from '../components/ui/Table.jsx'
import Badge from '../components/ui/Badge.jsx'
import Select from '../components/ui/Select.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Loader from '../components/ui/Loader.jsx'
import Modal from '../components/ui/Modal.jsx'
import Alert from '../components/ui/Alert.jsx'
import VehicleFormModal from '../components/vehicles/VehicleFormModal.jsx'

export default function Vehicles() {
  const { role } = useAuth()
  const editable = canEdit(role, 'fleet')
  const allowed = canAccess(role, 'fleet')

  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ type: 'All', status: 'All' })

  const [formOpen, setFormOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // silent=true is for background polling — no spinner, and a failed poll
  // doesn't replace an already-loaded table with an error screen.
  const loadVehicles = (silent = false) => {
    if (!silent) {
      setLoading(true)
      setLoadError(null)
    }
    getVehicles()
      .then((data) => {
        setVehicles(data)
        if (silent) setLoadError(null)
      })
      .catch((err) => {
        if (silent) {
          console.warn('Background vehicles refresh failed:', err.message)
          return
        }
        setLoadError(err.response?.data?.message || err.message || 'Could not load vehicles.')
      })
      .finally(() => {
        if (!silent) setLoading(false)
      })
  }

  useEffect(() => {
    if (allowed) loadVehicles()
  }, [allowed])

  usePolling(() => loadVehicles(true), { enabled: allowed, intervalMs: 20000 })

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        search.trim() === '' ||
        v.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.name.toLowerCase().includes(search.toLowerCase())
      const matchesType = filters.type === 'All' || v.type === filters.type
      const matchesStatus = filters.status === 'All' || v.status === filters.status
      return matchesSearch && matchesType && matchesStatus
    })
  }, [vehicles, search, filters])

  const handleAdd = () => {
    setEditingVehicle(null)
    setFormOpen(true)
  }

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle)
    setFormOpen(true)
  }

  const handleFormSubmit = async (payload) => {
    if (editingVehicle) {
      await updateVehicle(editingVehicle.id, payload)
    } else {
      await createVehicle(payload)
    }
    loadVehicles()
  }

  const handleDeleteConfirm = async () => {
    await deleteVehicle(deleteTarget.id)
    setDeleteTarget(null)
    loadVehicles()
  }

  const columns = [
    { key: 'registrationNumber', label: 'Registration Number' },
    { key: 'name', label: 'Vehicle Name' },
    { key: 'type', label: 'Type' },
    {
      key: 'capacity',
      label: 'Capacity',
      render: (row) => `${row.capacity.toLocaleString('en-IN')} kg`,
    },
    { key: 'region', label: 'Region' },
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
            Your role ({role}) doesn't have access to Vehicles.
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Vehicles</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {editable
              ? 'Manage your fleet’s vehicle registry.'
              : 'Viewing the fleet’s vehicle registry (read-only).'}
          </p>
        </div>
        {editable && (
          <Button onClick={handleAdd} className="flex w-auto items-center gap-1.5 px-4">
            <FiPlus size={15} /> Add Vehicle
          </Button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search by registration or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-auto min-w-[16rem]"
        />
        <Select
          value={filters.type}
          onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
          className="w-auto min-w-[9rem]"
        >
          {VEHICLE_TYPES.map((type) => (
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
          {VEHICLE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status === 'All' ? 'Status: All' : status}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading vehicles…" />
        ) : loadError ? (
          <div className="max-w-md">
            <Alert title="Couldn't load vehicles">{loadError}</Alert>
            <Button onClick={() => loadVehicles()} className="mt-3">
              Retry
            </Button>
          </div>
        ) : (
          <Table columns={columns} data={filteredVehicles} emptyMessage="No vehicles found." />
        )}
      </div>

      <VehicleFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        vehicle={editingVehicle}
      />

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Vehicle"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              className="w-auto px-4"
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} className="w-auto px-4 !bg-rose-600 hover:!bg-rose-700">
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-zinc-400">
          Remove <span className="text-zinc-200">{deleteTarget?.name}</span> (
          {deleteTarget?.registrationNumber}) from the registry? This can't be undone.
        </p>
      </Modal>
    </div>
  )
}
