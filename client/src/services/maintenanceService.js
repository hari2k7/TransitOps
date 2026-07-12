import api from './api.js'
import { updateVehicle } from './vehicleService.js'

let records = [
  {
    id: 1,
    vehicleId: 3, // Mini-08, already "In Shop" in vehicleService dummy data
    type: 'Repair',
    scheduledDate: '2026-07-10',
    cost: 8500,
    notes: 'Brake pad replacement.',
    status: 'In Progress',
  },
  {
    id: 2,
    vehicleId: 1, // Van-05, Available
    type: 'Routine Service',
    scheduledDate: '2026-07-20',
    cost: 3200,
    notes: '10,000 km service.',
    status: 'Scheduled',
  },
  {
    id: 3,
    vehicleId: 2, // Truck-11, On Trip
    type: 'Inspection',
    scheduledDate: '2026-06-15',
    cost: 1500,
    notes: 'Annual fitness inspection.',
    status: 'Completed',
  },
  {
    id: 4,
    vehicleId: 4, // Van-09, Retired
    type: 'Tire Change',
    scheduledDate: '2026-05-01',
    cost: 0,
    notes: 'Cancelled — vehicle retired before service.',
    status: 'Cancelled',
  },
]

let nextId = 5

// Keep the vehicle's status in sync with its maintenance record: work
// actually starting takes the vehicle "In Shop"; finishing (either way)
// frees it back up. Simplification for the hackathon — a real system would
// only restore the vehicle's *previous* status, not force "Available".
async function syncVehicleStatus(vehicleId, maintenanceStatus) {
  if (maintenanceStatus === 'In Progress') {
    await updateVehicle(Number(vehicleId), { status: 'In Shop' })
  } else if (maintenanceStatus === 'Completed' || maintenanceStatus === 'Cancelled') {
    await updateVehicle(Number(vehicleId), { status: 'Available' })
  }
}

// TODO: swap each of these for real Axios calls once the maintenance
// endpoints are live (per backend guide: GET/POST /api/maintenance,
// GET/PUT/DELETE /api/maintenance/:id).

export async function getMaintenanceRecords() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return records

  // const { data } = await api.get('/maintenance')
  // return data.data
}

export async function createMaintenance(payload) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const record = { id: nextId++, ...payload, vehicleId: Number(payload.vehicleId) }
  records = [...records, record]
  await syncVehicleStatus(record.vehicleId, record.status)
  return record

  // const { data } = await api.post('/maintenance', payload)
  // return data.data
}

export async function updateMaintenance(id, payload) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  records = records.map((r) =>
    r.id === id ? { ...r, ...payload, vehicleId: Number(payload.vehicleId) } : r,
  )
  const updated = records.find((r) => r.id === id)
  await syncVehicleStatus(updated.vehicleId, updated.status)
  return updated

  // const { data } = await api.put(`/maintenance/${id}`, payload)
  // return data.data
}

export async function deleteMaintenance(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  records = records.filter((r) => r.id !== id)

  // await api.delete(`/maintenance/${id}`)
}
