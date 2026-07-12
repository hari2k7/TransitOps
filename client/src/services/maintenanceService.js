import api from './api.js'

// scheduledDate -> start_date is a rename, not just a case change. Vehicle
// status sync (In Progress -> In Shop, Completed/Cancelled -> Available) now
// happens server-side in maintenance.service.js, transactionally with the
// record write — no separate updateVehicle() call needed here anymore.
function toApiPayload(record) {
  return {
    vehicle_id: Number(record.vehicleId),
    type: record.type,
    description: record.notes || '',
    cost: record.cost,
    start_date: record.scheduledDate,
    status: record.status,
  }
}

function fromApiRow(row) {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    type: row.type,
    scheduledDate: row.start_date,
    endDate: row.end_date,
    cost: Number(row.cost),
    notes: row.description || '',
    status: row.status,
    registrationNumber: row.registration_number,
    vehicleName: row.vehicle_name,
  }
}

export async function getMaintenanceRecords() {
  const { data } = await api.get('/maintenance')
  return data.data.map(fromApiRow)
}

export async function createMaintenance(payload) {
  const { data } = await api.post('/maintenance', toApiPayload(payload))
  return fromApiRow(data.data)
}

export async function updateMaintenance(id, payload) {
  const { data } = await api.put(`/maintenance/${id}`, toApiPayload(payload))
  return fromApiRow(data.data)
}

export async function deleteMaintenance(id) {
  await api.delete(`/maintenance/${id}`)
}
