import api from './api.js'
import { getVehicles, updateVehicle } from './vehicleService.js'
import { getDrivers, updateDriver } from './driverService.js'

let trips = [
  {
    id: 1,
    source: 'Gandhinagar Depot',
    destination: 'Ahmedabad Hub',
    vehicleId: 2, // Truck-11, already "On Trip" in vehicleService dummy data
    driverId: 3, // Priya, already "On Trip" in driverService dummy data
    cargo: 450,
    distance: 38,
    priority: 'Medium',
    expectedDelivery: '2026-07-14',
    notes: 'Standard delivery run.',
    status: 'Dispatched',
    createdAt: '2026-07-12T09:15:00Z',
  },
  {
    id: 2,
    source: 'Vatva Industrial Area',
    destination: 'Sanand Warehouse',
    vehicleId: 1, // Van-05, Available
    driverId: 4, // Suresh, Available
    cargo: 800,
    distance: 22,
    priority: 'High',
    expectedDelivery: '2026-07-13',
    notes: 'Fragile goods, handle with care.',
    status: 'Draft',
    createdAt: '2026-07-12T10:02:00Z',
  },
  {
    id: 3,
    source: 'Maninagar',
    destination: 'Kalol Depot',
    vehicleId: 4, // Van-09, Retired — fine for a historical cancelled trip
    driverId: 2, // John, Suspended — fine for a historical cancelled trip
    cargo: 2000,
    distance: 34,
    priority: 'Low',
    expectedDelivery: '2026-07-12',
    notes: '',
    status: 'Cancelled',
    createdAt: '2026-07-11T16:40:00Z',
  },
]

let nextId = 4

function isLicenseExpired(driver) {
  return new Date(driver.licenseExpiry) < new Date()
}

// TODO: swap each of these for real Axios calls once the trip endpoints are
// live (per backend guide: GET/POST /api/trips, PUT /api/trips/:id/dispatch,
// PUT /api/trips/:id/complete, PUT /api/trips/:id/cancel).

export async function getTrips() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return trips

  // const { data } = await api.get('/trips')
  // return data.data
}

export async function createTrip(payload) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const vehicles = await getVehicles()
  const drivers = await getDrivers()
  const vehicle = vehicles.find((v) => String(v.id) === String(payload.vehicleId))
  const driver = drivers.find((d) => String(d.id) === String(payload.driverId))

  if (!vehicle || vehicle.status !== 'Available') {
    throw new Error('Selected vehicle is not available.')
  }
  if (!driver || driver.status !== 'Available') {
    throw new Error('Selected driver is not available.')
  }
  if (driver.status === 'Suspended' || isLicenseExpired(driver)) {
    throw new Error('Driver license is expired or suspended.')
  }
  if (Number(payload.cargo) > vehicle.capacity) {
    throw new Error(
      `Cargo (${payload.cargo} kg) exceeds vehicle capacity (${vehicle.capacity} kg).`,
    )
  }

  const trip = {
    id: nextId++,
    ...payload,
    vehicleId: vehicle.id,
    driverId: driver.id,
    status: 'Draft',
    createdAt: new Date().toISOString(),
  }
  trips = [...trips, trip]
  return trip

  // const { data } = await api.post('/trips', payload)
  // return data.data
}

export async function dispatchTrip(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const trip = trips.find((t) => t.id === id)
  if (!trip || trip.status !== 'Draft') {
    throw new Error('Only Draft trips can be dispatched.')
  }

  await updateVehicle(trip.vehicleId, { status: 'On Trip' })
  await updateDriver(trip.driverId, { status: 'On Trip' })
  trips = trips.map((t) => (t.id === id ? { ...t, status: 'Dispatched' } : t))
  return trips.find((t) => t.id === id)
}

export async function completeTrip(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const trip = trips.find((t) => t.id === id)
  if (!trip || trip.status !== 'Dispatched') {
    throw new Error('Only Dispatched trips can be completed.')
  }

  await updateVehicle(trip.vehicleId, { status: 'Available' })
  await updateDriver(trip.driverId, { status: 'Available' })
  trips = trips.map((t) => (t.id === id ? { ...t, status: 'Completed' } : t))
  return trips.find((t) => t.id === id)
}

export async function cancelTrip(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const trip = trips.find((t) => t.id === id)
  if (!trip || !['Draft', 'Dispatched'].includes(trip.status)) {
    throw new Error('Only Draft or Dispatched trips can be cancelled.')
  }

  if (trip.status === 'Dispatched') {
    await updateVehicle(trip.vehicleId, { status: 'Available' })
    await updateDriver(trip.driverId, { status: 'Available' })
  }
  trips = trips.map((t) => (t.id === id ? { ...t, status: 'Cancelled' } : t))
  return trips.find((t) => t.id === id)
}

export async function deleteTrip(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  trips = trips.filter((t) => t.id !== id)

  // await api.delete(`/trips/${id}`)
}
