import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import Button from '../ui/Button.jsx'
import { driverSchema } from '../../utils/schemas/driverSchema.js'
import { DRIVER_STATUSES, LICENSE_CATEGORIES } from '../../utils/constants.js'

const EMPTY_FORM = {
  name: '',
  licenseNumber: '',
  licenseCategory: 'LMV',
  licenseExpiry: '',
  contactNumber: '',
  safetyScore: '',
  status: 'Available',
}

export default function DriverFormModal({ open, onClose, onSubmit, driver }) {
  const [form, setForm] = useState(driver ?? EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  // Reset form whenever a different driver (or "add new") is opened.
  if (driver && form.id !== driver.id) {
    setForm(driver)
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    const result = driverSchema.safeParse(form)
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
      title={driver ? 'Edit Driver' : 'Add Driver'}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input label="Name" value={form.name} onChange={handleChange('name')} />
        {errors.name && <p className="-mt-2.5 text-xs text-rose-400">{errors.name}</p>}

        <Input
          label="License Number"
          value={form.licenseNumber}
          onChange={handleChange('licenseNumber')}
        />
        {errors.licenseNumber && (
          <p className="-mt-2.5 text-xs text-rose-400">{errors.licenseNumber}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Select
              label="License Category"
              value={form.licenseCategory}
              onChange={handleChange('licenseCategory')}
            >
              {LICENSE_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Input
              label="License Expiry"
              type="date"
              value={form.licenseExpiry}
              onChange={handleChange('licenseExpiry')}
            />
            {errors.licenseExpiry && (
              <p className="mt-1 text-xs text-rose-400">{errors.licenseExpiry}</p>
            )}
          </div>
        </div>

        <div>
          <Input
            label="Contact Number"
            value={form.contactNumber}
            onChange={handleChange('contactNumber')}
            placeholder="10-digit number"
          />
          {errors.contactNumber && (
            <p className="mt-1 text-xs text-rose-400">{errors.contactNumber}</p>
          )}
        </div>

        <div>
          <Input
            label="Safety Score (0–100)"
            type="number"
            value={form.safetyScore}
            onChange={handleChange('safetyScore')}
          />
          {errors.safetyScore && (
            <p className="mt-1 text-xs text-rose-400">{errors.safetyScore}</p>
          )}
        </div>

        <Select label="Status" value={form.status} onChange={handleChange('status')}>
          {DRIVER_STATUSES.filter((s) => s !== 'All').map((status) => (
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
