import api from './api.js'

let fuelLogs = [
  { id: 1, vehicleId: 1, liters: 42.5, cost: 4200, date: '2026-07-08' },
  { id: 2, vehicleId: 2, liters: 88.0, cost: 8850, date: '2026-07-10' },
  { id: 3, vehicleId: 3, liters: 30.2, cost: 3050, date: '2026-07-11' },
]

let nextId = 4

// TODO: swap for real Axios calls once GET/POST /api/fuel-logs are live.

export async function getFuelLogs() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return fuelLogs

  // const { data } = await api.get('/fuel-logs')
  // return data.data
}

export async function createFuelLog(payload) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const log = {
    id: nextId++,
    ...payload,
    vehicleId: Number(payload.vehicleId),
    liters: Number(payload.liters),
    cost: Number(payload.cost),
  }
  fuelLogs = [log, ...fuelLogs]
  return log

  // const { data } = await api.post('/fuel-logs', payload)
  // return data.data
}
