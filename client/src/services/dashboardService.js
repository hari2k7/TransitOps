import api from './api.js'

const DUMMY_STATS = {
  totalVehicles: 58,
  availableVehicles: 42,
  vehiclesOnTrip: 11,
  vehiclesInShop: 5,
  vehiclesRetired: 0,
  totalDrivers: 34,
  availableDrivers: 26,
  activeTrips: 18,
  maintenanceActive: 5,
  fuelCost: 82500,
  expenseCost: 34700,
}

const DUMMY_RECENT_TRIPS = [
  { id: 'TR001', vehicle: 'Van-05', driver: 'Alex', status: 'On Trip', eta: '45 min' },
  { id: 'TR002', vehicle: 'Truck-11', driver: 'John', status: 'Completed', eta: '—' },
  { id: 'TR003', vehicle: 'Mini-08', driver: 'Priya', status: 'Dispatched', eta: '1h 10m' },
  { id: 'TR004', vehicle: '—', driver: '—', status: 'Draft', eta: 'Awaiting vehicle' },
  { id: 'TR005', vehicle: 'Van-12', driver: 'Suresh', status: 'Cancelled', eta: '—' },
]

// TODO: swap for the real call once GET /api/dashboard is live.
// Expected response (per backend guide): { success, message, data: {...} }
// Filters (vehicleType, status, region) aren't documented on this endpoint
// yet — passed as query params here so it's a one-line swap once confirmed.
export async function getDashboardStats(filters = {}) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return DUMMY_STATS

  // Real call, once ready:
  // const { data } = await api.get('/dashboard', { params: filters })
  // return data.data
}

// TODO: swap for a real GET /api/trips?limit=5 call once available.
export async function getRecentTrips() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return DUMMY_RECENT_TRIPS
}
