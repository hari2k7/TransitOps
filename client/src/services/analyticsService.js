import api from './api.js'

// GET /api/analytics is gated to just the 'analytics' permission (Fleet
// Manager, Financial Analyst) and aggregates server-side — it deliberately
// does NOT go through getVehicles()/getDrivers()/getTrips()/
// getMaintenanceRecords(), because those REST endpoints are gated by their
// own module RBAC and neither analytics-permitted role has access to all
// four (Fleet Manager has no trips access, Financial Analyst has no
// drivers access). See server/src/services/analytics.service.js.
export async function getAnalytics() {
  const { data } = await api.get('/analytics')
  return data.data
}
