import api from './api.js'

let vehicles = [
  {
    id: 1,
    registrationNumber: 'GJ01AB6205',
    name: 'Van-05',
    type: 'Van',
    capacity: 500,
    odometer: 14000,
    acquisitionCost: 620000,
    region: 'North',
    status: 'Available',
  },
  {
    id: 2,
    registrationNumber: 'GJ01AB6206',
    name: 'Truck-11',
    type: 'Truck',
    capacity: 5000,
    odometer: 112000,
    acquisitionCost: 2450000,
    region: 'South',
    status: 'On Trip',
  },
  {
    id: 3,
    registrationNumber: 'GJ01AB6207',
    name: 'Mini-08',
    type: 'Mini Truck',
    capacity: 1000,
    odometer: 66000,
    acquisitionCost: 410000,
    region: 'East',
    status: 'In Shop',
  },
  {
    id: 4,
    registrationNumber: 'GJ01AB6208',
    name: 'Van-09',
    type: 'Van',
    capacity: 750,
    odometer: 214000,
    acquisitionCost: 540000,
    region: 'West',
    status: 'Retired',
  },
]

let nextId = 5

// TODO: swap each of these for real Axios calls once the vehicle endpoints
// are live (per backend guide: GET/POST /api/vehicles, GET/PUT/DELETE
// /api/vehicles/:id). All wrapped in the standard { success, message, data }
// response shape, so `return data.data` once real.

export async function getVehicles() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return vehicles

  // const { data } = await api.get('/vehicles')
  // return data.data
}

export async function getVehicleById(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const vehicle = vehicles.find((v) => v.id === Number(id))
  if (!vehicle) throw new Error('Vehicle not found.')
  return vehicle

  // const { data } = await api.get(`/vehicles/${id}`)
  // return data.data
}

export async function createVehicle(payload) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const exists = vehicles.some(
    (v) => v.registrationNumber === payload.registrationNumber,
  )
  if (exists) {
    throw new Error('Registration number must be unique.')
  }

  const vehicle = { id: nextId++, ...payload }
  vehicles = [...vehicles, vehicle]
  return vehicle

  // const { data } = await api.post('/vehicles', payload)
  // return data.data
}

export async function updateVehicle(id, payload) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const duplicate = vehicles.some(
    (v) => v.id !== id && v.registrationNumber === payload.registrationNumber,
  )
  if (duplicate) {
    throw new Error('Registration number must be unique.')
  }

  vehicles = vehicles.map((v) => (v.id === id ? { ...v, ...payload } : v))
  return vehicles.find((v) => v.id === id)

  // const { data } = await api.put(`/vehicles/${id}`, payload)
  // return data.data
}

export async function deleteVehicle(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  vehicles = vehicles.filter((v) => v.id !== id)

  // await api.delete(`/vehicles/${id}`)
}
