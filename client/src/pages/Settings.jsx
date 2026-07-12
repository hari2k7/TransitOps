import { useEffect, useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import { useSettings } from '../context/SettingsContext.jsx'
import { CURRENCIES } from '../utils/currency.js'
import Input from '../components/ui/Input.jsx'
import Select from '../components/ui/Select.jsx'
import Button from '../components/ui/Button.jsx'

const DISTANCE_UNITS = ['Kilometers', 'Miles']

export default function Settings() {
  const { depotName, currency, distanceUnit, updateSettings } = useSettings()

  const [form, setForm] = useState({ depotName, currency, distanceUnit })
  const [saved, setSaved] = useState(false)

  // Keep the form in sync if settings change elsewhere (e.g. another tab).
  useEffect(() => {
    setForm({ depotName, currency, distanceUnit })
  }, [depotName, currency, distanceUnit])

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setSaved(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    updateSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="mx-auto max-w-lg text-center">
      <h1 className="text-xl font-semibold text-zinc-100">Settings</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Depot-wide preferences — these apply across the whole app.
      </p>

      <form
        onSubmit={handleSave}
        className="mt-6 space-y-4 rounded-xl border border-border-subtle bg-surface-raised p-6 text-left"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">General</p>

        <Input
          label="Depot Name"
          placeholder="e.g. Gandhinagar Depot GJ4"
          value={form.depotName}
          onChange={handleChange('depotName')}
        />

        <Select label="Currency" value={form.currency} onChange={handleChange('currency')}>
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </Select>

        <Select
          label="Distance Unit"
          value={form.distanceUnit}
          onChange={handleChange('distanceUnit')}
        >
          {DISTANCE_UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </Select>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" className="w-auto px-5">
            Save changes
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <FiCheck size={14} /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
