import { getVehicles } from './vehicleService.js'
import { getDrivers } from './driverService.js'
import { getTrips } from './tripService.js'
import { getMaintenanceRecords } from './maintenanceService.js'

// TODO: swap for a single real Axios call once GET /api/analytics is live
// (backend guide notes the analytics model/controller already exist).
// For now this aggregates the same dummy data every other page already
// uses, so the numbers here stay consistent with Vehicles/Drivers/Trips/
// Maintenance.

function safetyBand(score) {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Good'
  if (score >= 60) return 'Fair'
  return 'Needs Attention'
}

export async function getAnalytics() {
  const [vehicles, drivers, trips, maintenance] = await Promise.all([
    getVehicles(),
    getDrivers(),
    getTrips(),
    getMaintenanceRecords(),
  ])

  await new Promise((resolve) => setTimeout(resolve, 250))

  const totalVehicles = vehicles.length
  const onTrip = vehicles.filter((v) => v.status === 'On Trip').length
  const available = vehicles.filter((v) => v.status === 'Available').length
  const retired = vehicles.filter((v) => v.status === 'Retired').length
  const utilizationPct = totalVehicles ? Math.round((onTrip / totalVehicles) * 100) : 0
  const availabilityPct = totalVehicles ? Math.round((available / totalVehicles) * 100) : 0
  const totalFleetValue = vehicles.reduce((sum, v) => sum + (v.acquisitionCost || 0), 0)

  const vehicleTypeBreakdown = Object.entries(
    vehicles.reduce((acc, v) => {
      acc[v.type] = (acc[v.type] || 0) + 1
      return acc
    }, {}),
  ).map(([type, count]) => ({ type, count }))

  const tripStatusBreakdown = ['Draft', 'Dispatched', 'Completed', 'Cancelled'].map((status) => ({
    status,
    count: trips.filter((t) => t.status === status).length,
  }))
  const activeTrips = trips.filter((t) => t.status === 'Dispatched').length

  const totalMaintenanceSpend = maintenance.reduce((sum, m) => sum + (Number(m.cost) || 0), 0)
  const maintenanceCostByType = Object.entries(
    maintenance.reduce((acc, m) => {
      acc[m.type] = (acc[m.type] || 0) + Number(m.cost || 0)
      return acc
    }, {}),
  ).map(([type, cost]) => ({ type, cost }))
  const openWorkOrders = maintenance.filter((m) =>
    ['Scheduled', 'In Progress'].includes(m.status),
  ).length

  const avgSafetyScore = drivers.length
    ? Math.round(drivers.reduce((sum, d) => sum + d.safetyScore, 0) / drivers.length)
    : 0

  const driverSafety = drivers
    .map((d) => ({ name: d.name, score: d.safetyScore, band: safetyBand(d.safetyScore) }))
    .sort((a, b) => b.score - a.score)

  return {
    totalVehicles,
    utilizationPct,
    availabilityPct,
    totalFleetValue,
    vehicleTypeBreakdown,
    tripStatusBreakdown,
    activeTrips,
    totalMaintenanceSpend,
    maintenanceCostByType,
    openWorkOrders,
    avgSafetyScore,
    driverSafety,
    retired,
  }
}
