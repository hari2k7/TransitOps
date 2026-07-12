import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import Button from '../ui/Button.jsx'
import { vehicleSchema } from '../../utils/schemas/vehicleSchema.js'
import { VEHICLE_TYPES, VEHICLE_STATUSES, REGIONS } from '../../utils/constants.js'
import { useSettings } from '../../context/SettingsContext.jsx'
import { currencySymbol } from '../../utils/currency.js'

const EMPTY_FORM = {
  registrationNumber: '',
  name: '',
  type: 'Van',
  capacity: '',
  odometer: '',
  acquisitionCost: '',
  region: 'North',
  status: 'Available',
}

export default function VehicleFormModal({ open, onClose, onSubmit, vehicle }) {
  const { currency } = useSettings()
  const [form, setForm] = useState(vehicle ?? EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  // Reset form whenever a different vehicle (or "add new") is opened.
  if (vehicle && form.id !== vehicle.id) {
    setForm(vehicle)
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    const result = vehicleSchema.safeParse(form)
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
      setFormError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.')
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
      title={vehicle ? 'Edit Vehicle' : 'Add Vehicle'}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Registration Number"
          value={form.registrationNumber}
          onChange={handleChange('registrationNumber')}
        />
        {errors.registrationNumber && (
          <p className="-mt-2.5 text-xs text-rose-400">{errors.registrationNumber}</p>
        )}

        <Input
          label="Vehicle Name"
          value={form.name}
          onChange={handleChange('name')}
        />
        {errors.name && <p className="-mt-2.5 text-xs text-rose-400">{errors.name}</p>}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Select label="Type" value={form.type} onChange={handleChange('type')}>
              {VEHICLE_TYPES.filter((t) => t !== 'All').map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Select label="Region" value={form.region} onChange={handleChange('region')}>
              {REGIONS.filter((r) => r !== 'All').map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input
              label="Capacity (kg)"
              type="number"
              value={form.capacity}
              onChange={handleChange('capacity')}
            />
            {errors.capacity && (
              <p className="mt-1 text-xs text-rose-400">{errors.capacity}</p>
            )}
          </div>
          <div>
            <Input
              label="Odometer (km)"
              type="number"
              value={form.odometer}
              onChange={handleChange('odometer')}
            />
            {errors.odometer && (
              <p className="mt-1 text-xs text-rose-400">{errors.odometer}</p>
            )}
          </div>
        </div>

        <div>
          <Input
            label={`Acquisition Cost (${currencySymbol(currency)})`}
            type="number"
            value={form.acquisitionCost}
            onChange={handleChange('acquisitionCost')}
          />
          {errors.acquisitionCost && (
            <p className="mt-1 text-xs text-rose-400">{errors.acquisitionCost}</p>
          )}
        </div>

        <Select label="Status" value={form.status} onChange={handleChange('status')}>
          {VEHICLE_STATUSES.filter((s) => s !== 'All').map((status) => (
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
