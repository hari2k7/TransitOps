import api from './api.js'

let drivers = [
  {
    id: 1,
    name: 'Alex',
    licenseNumber: 'DL-99215',
    licenseCategory: 'LMV',
    licenseExpiry: '2028-12-01',
    contactNumber: '9876500001',
    safetyScore: 96,
    status: 'Available',
  },
  {
    id: 2,
    name: 'John',
    licenseNumber: 'DL-44120',
    licenseCategory: 'HMV',
    licenseExpiry: '2025-05-20',
    contactNumber: '9876500002',
    safetyScore: 87,
    status: 'Suspended',
  },
  {
    id: 3,
    name: 'Priya',
    licenseNumber: 'DL-71031',
    licenseCategory: 'LMV',
    licenseExpiry: '2027-08-01',
    contactNumber: '9876500003',
    safetyScore: 91,
    status: 'On Trip',
  },
  {
    id: 4,
    name: 'Suresh',
    licenseNumber: 'DL-90045',
    licenseCategory: 'HMV',
    licenseExpiry: '2027-01-01',
    contactNumber: '9876500004',
    safetyScore: 88,
    status: 'Available',
  },
]

let nextId = 5

// TODO: swap for real Axios calls once GET/POST /api/drivers and
// GET/PUT/DELETE /api/drivers/:id are live (per backend guide).

export async function getDrivers() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return drivers

  // const { data } = await api.get('/drivers')
  // return data.data
}

export async function getDriverById(id) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const driver = drivers.find((d) => d.id === Number(id))
  if (!driver) throw new Error('Driver not found.')
  return driver
}

export async function createDriver(payload) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const exists = drivers.some((d) => d.licenseNumber === payload.licenseNumber)
  if (exists) throw new Error('License number must be unique.')

  const driver = { id: nextId++, ...payload }
  drivers = [...drivers, driver]
  return driver
}

export async function updateDriver(id, payload) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  drivers = drivers.map((d) => (d.id === id ? { ...d, ...payload } : d))
  return drivers.find((d) => d.id === id)
}

export async function deleteDriver(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  drivers = drivers.filter((d) => d.id !== id)
}
