import { createContext, useContext, useState } from 'react'

const SettingsContext = createContext(null)

const STORAGE_KEY = 'transitops_settings'

const DEFAULT_SETTINGS = {
  depotName: 'Gandhinagar Depot GJ4',
  currency: 'INR',
  distanceUnit: 'Kilometers',
}

function loadStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadStoredSettings)

  const updateSettings = (next) => {
    const merged = { ...settings, ...next }
    setSettings(merged)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  }

  return (
    <SettingsContext.Provider value={{ ...settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
