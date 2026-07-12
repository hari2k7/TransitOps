import { useEffect, useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import Button from '../ui/Button.jsx'
import { maintenanceSchema } from '../../utils/schemas/maintenanceSchema.js'
import { MAINTENANCE_TYPES, MAINTENANCE_STATUSES } from '../../utils/constants.js'
import { getVehicles } from '../../services/vehicleService.js'

const EMPTY_FORM = {
  vehicleId: '',
  type: 'Routine Service',
  scheduledDate: '',
  cost: '',
  notes: '',
  status: 'Scheduled',
}

export default function MaintenanceFormModal({ open, onClose, onSubmit, record }) {
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(record ? { ...record, vehicleId: String(record.vehicleId) } : EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    if (open) getVehicles().then(setVehicles)
  }, [open])

  // Reset form whenever a different record (or "add new") is opened.
  if (record && form.id !== record.id) {
    setForm({ ...record, vehicleId: String(record.vehicleId) })
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    const result = maintenanceSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors = {}
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(result.data)
      handleClose()
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setFormError(null)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={record ? 'Edit Maintenance Record' : 'Add Maintenance Record'}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <Select label="Vehicle" value={form.vehicleId} onChange={handleChange('vehicleId')}>
            <option value="">Select a vehicle…</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.registrationNumber})
              </option>
            ))}
          </Select>
          {errors.vehicleId && <p className="mt-1 text-xs text-rose-400">{errors.vehicleId}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Select label="Type" value={form.type} onChange={handleChange('type')}>
              {MAINTENANCE_TYPES.filter((t) => t !== 'All').map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Input
              label="Scheduled Date"
              type="date"
              value={form.scheduledDate}
              onChange={handleChange('scheduledDate')}
            />
            {errors.scheduledDate && (
              <p className="mt-1 text-xs text-rose-400">{errors.scheduledDate}</p>
            )}
          </div>
        </div>

        <div>
          <Input
            label="Cost (₹)"
            type="number"
            value={form.cost}
            onChange={handleChange('cost')}
          />
          {errors.cost && <p className="mt-1 text-xs text-rose-400">{errors.cost}</p>}
        </div>

        <label className="block text-left">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500">
            Notes
          </span>
          <textarea
            rows={3}
            value={form.notes}
            onChange={handleChange('notes')}
            className="w-full rounded-md border border-border-subtle bg-surface-raised px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </label>

        <Select label="Status" value={form.status} onChange={handleChange('status')}>
          {MAINTENANCE_STATUSES.filter((s) => s !== 'All').map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>

        {formError && <p className="text-xs text-rose-400">{formError}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose} className="w-auto px-4">
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="w-auto px-4">
            {submitting ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
