import api from './api.js'

// getDashboardStats() already returns camelCase field names from the
// backend (it builds a plain object of computed aggregates, not raw DB
// rows), so no case-mapping is needed here.
export async function getDashboardStats(filters = {}) {
  const { data } = await api.get('/dashboard', { params: filters })
  return data.data
}

// No real ETA data exists in the schema — show something honest instead of
// fabricating a countdown. GET /dashboard/recent-trips bypasses the Trips
// module's RBAC gate on purpose, since every role sees this on their
// landing page regardless of Trips access.
export async function getRecentTrips() {
  const { data } = await api.get('/dashboard/recent-trips')

  return data.data.map((row) => ({
    id: `TR${String(row.id).padStart(3, '0')}`,
    vehicle: row.vehicle_name || '—',
    driver: row.driver_name || '—',
    status: row.status,
    eta: row.status === 'Dispatched' ? 'In transit' : '—',
  }))
}
