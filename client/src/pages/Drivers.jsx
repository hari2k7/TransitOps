import { useEffect, useMemo, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext.jsx'
import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from '../services/driverService.js'
import { canEdit, canAccess } from '../utils/permissions.js'
import { DRIVER_STATUSES, LICENSE_CATEGORIES } from '../utils/constants.js'
import Table from '../components/ui/Table.jsx'
import Badge from '../components/ui/Badge.jsx'
import Select from '../components/ui/Select.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Loader from '../components/ui/Loader.jsx'
import Modal from '../components/ui/Modal.jsx'
import Alert from '../components/ui/Alert.jsx'
import DriverFormModal from '../components/drivers/DriverFormModal.jsx'

function isExpired(dateStr) {
  return new Date(dateStr) < new Date()
}

export default function Drivers() {
  const { role } = useAuth()
  const editable = canEdit(role, 'drivers')
  const allowed = canAccess(role, 'drivers')

  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: 'All', category: 'All' })

  const [formOpen, setFormOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const loadDrivers = () => {
    setLoading(true)
    getDrivers().then((data) => {
      setDrivers(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    if (allowed) loadDrivers()
  }, [allowed])

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const matchesSearch =
        search.trim() === '' ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.licenseNumber.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = filters.status === 'All' || d.status === filters.status
      const matchesCategory =
        filters.category === 'All' || d.licenseCategory === filters.category
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [drivers, search, filters])

  const handleAdd = () => {
    setEditingDriver(null)
    setFormOpen(true)
  }

  const handleEdit = (driver) => {
    setEditingDriver(driver)
    setFormOpen(true)
  }

  const handleFormSubmit = async (payload) => {
    if (editingDriver) {
      await updateDriver(editingDriver.id, payload)
    } else {
      await createDriver(payload)
    }
    loadDrivers()
  }

  const handleDeleteConfirm = async () => {
    await deleteDriver(deleteTarget.id)
    setDeleteTarget(null)
    loadDrivers()
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'licenseNumber', label: 'License Number' },
    { key: 'licenseCategory', label: 'Category' },
    {
      key: 'licenseExpiry',
      label: 'License Expiry',
      render: (row) => (
        <span className={isExpired(row.licenseExpiry) ? 'font-medium text-rose-400' : ''}>
          {row.licenseExpiry}
          {isExpired(row.licenseExpiry) ? ' (Expired)' : ''}
        </span>
      ),
    },
    { key: 'contactNumber', label: 'Contact' },
    { key: 'safetyScore', label: 'Safety Score' },
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
            Your role ({role}) doesn't have access to Drivers.
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Drivers</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {editable
              ? 'Manage your driver roster and license compliance.'
              : 'Viewing the driver roster (read-only).'}
          </p>
        </div>
        {editable && (
          <Button onClick={handleAdd} className="flex w-auto items-center gap-1.5 px-4">
            <FiPlus size={15} /> Add Driver
          </Button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search by name or license number…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-auto min-w-[16rem]"
        />
        <Select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          className="w-auto min-w-[9rem]"
        >
          {DRIVER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status === 'All' ? 'Status: All' : status}
            </option>
          ))}
        </Select>
        <Select
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          className="w-auto min-w-[9rem]"
        >
          {LICENSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'Category: All' : cat}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading drivers…" />
        ) : (
          <Table columns={columns} data={filteredDrivers} emptyMessage="No drivers found." />
        )}
      </div>

      <DriverFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        driver={editingDriver}
      />

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Driver"
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
          Remove <span className="text-zinc-200">{deleteTarget?.name}</span> (
          {deleteTarget?.licenseNumber}) from the roster? This can't be undone.
        </p>
      </Modal>
    </div>
  )
}
