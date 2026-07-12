import api from './api.js'

// Backend column names don't line up 1:1 with the frontend fields (name ->
// vehicle_name, type -> vehicle_type, capacity -> max_capacity), so this
// maps explicitly rather than relying on a generic snake/camel converter.
function toApiPayload(vehicle) {
  return {
    registration_number: vehicle.registrationNumber,
    vehicle_name: vehicle.name,
    vehicle_type: vehicle.type,
    max_capacity: vehicle.capacity,
    odometer: vehicle.odometer,
    acquisition_cost: vehicle.acquisitionCost,
    region: vehicle.region,
    status: vehicle.status,
  }
}

function fromApiRow(row) {
  return {
    id: row.id,
    registrationNumber: row.registration_number,
    name: row.vehicle_name,
    type: row.vehicle_type,
    capacity: Number(row.max_capacity),
    odometer: Number(row.odometer),
    acquisitionCost: Number(row.acquisition_cost),
    region: row.region,
    status: row.status,
  }
}

export async function getVehicles() {
  const { data } = await api.get('/vehicles')
  return data.data.map(fromApiRow)
}

export async function getVehicleById(id) {
  const { data } = await api.get(`/vehicles/${id}`)
  return fromApiRow(data.data)
}

export async function createVehicle(payload) {
  const { data } = await api.post('/vehicles', toApiPayload(payload))
  return fromApiRow(data.data)
}

export async function updateVehicle(id, payload) {
  const { data } = await api.put(`/vehicles/${id}`, toApiPayload(payload))
  return fromApiRow(data.data)
}

export async function deleteVehicle(id) {
  await api.delete(`/vehicles/${id}`)
}
