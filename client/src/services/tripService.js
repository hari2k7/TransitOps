import api from './api.js'

// A few fields are renamed (not just re-cased) between frontend and backend:
// cargo -> cargo_weight, distance -> planned_distance.
function toApiPayload(trip) {
  return {
    vehicle_id: trip.vehicleId,
    driver_id: trip.driverId,
    source: trip.source,
    destination: trip.destination,
    cargo_weight: trip.cargo,
    planned_distance: trip.distance,
    priority: trip.priority,
    expected_delivery: trip.expectedDelivery || null,
    notes: trip.notes || '',
  }
}

function fromApiRow(row) {
  return {
    id: row.id,
    source: row.source,
    destination: row.destination,
    vehicleId: row.vehicle_id,
    driverId: row.driver_id,
    cargo: Number(row.cargo_weight),
    distance: Number(row.planned_distance),
    revenue: row.revenue === null ? null : Number(row.revenue),
    priority: row.priority,
    expectedDelivery: row.expected_delivery,
    notes: row.notes || '',
    status: row.status,
    createdAt: row.created_at,
  }
}

export async function getTrips() {
  const { data } = await api.get('/trips')
  return data.data.map(fromApiRow)
}

export async function createTrip(payload) {
  // Business-rule checks (vehicle/driver availability, cargo vs capacity,
  // license expiry) now happen server-side in trip.service.js — the backend
  // rejects with a message we can surface as-is.
  const { data } = await api.post('/trips', toApiPayload(payload))
  return fromApiRow(data.data)
}

// These three only return { success, message } (no updated row) — the page
// re-fetches trips/vehicles/drivers afterward, so nothing here needs
// to reshape a return value.
export async function dispatchTrip(id) {
  await api.put(`/trips/${id}/dispatch`)
}

export async function completeTrip(id) {
  await api.put(`/trips/${id}/complete`)
}

export async function cancelTrip(id) {
  await api.put(`/trips/${id}/cancel`)
}

export async function deleteTrip(id) {
  await api.delete(`/trips/${id}`)
}
