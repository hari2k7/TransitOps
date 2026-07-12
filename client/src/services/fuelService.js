import api from './api.js'

// date -> log_date is a rename, not just a case change.
function toApiPayload(log) {
  return {
    vehicle_id: Number(log.vehicleId),
    liters: Number(log.liters),
    cost: Number(log.cost),
    log_date: log.date,
  }
}

function fromApiRow(row) {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    liters: Number(row.liters),
    cost: Number(row.cost),
    date: row.log_date,
  }
}

export async function getFuelLogs() {
  const { data } = await api.get('/fuel-logs')
  return data.data.map(fromApiRow)
}

export async function createFuelLog(payload) {
  const { data } = await api.post('/fuel-logs', toApiPayload(payload))
  return fromApiRow(data.data)
}
