import api from './api.js'
import { toCamel, toSnake } from '../utils/caseMapper.js'

export async function getDrivers() {
  const { data } = await api.get('/drivers')
  return toCamel(data.data)
}

export async function getDriverById(id) {
  const { data } = await api.get(`/drivers/${id}`)
  return toCamel(data.data)
}

export async function createDriver(payload) {
  const { data } = await api.post('/drivers', toSnake(payload))
  return toCamel(data.data)
}

export async function updateDriver(id, payload) {
  const { data } = await api.put(`/drivers/${id}`, toSnake(payload))
  return toCamel(data.data)
}

export async function deleteDriver(id) {
  await api.delete(`/drivers/${id}`)
}
