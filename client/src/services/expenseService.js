import api from './api.js'

let expenses = [
  { id: 1, vehicleId: 2, type: 'Toll', amount: 350, date: '2026-07-09', notes: 'NH-544 toll plaza' },
  { id: 2, vehicleId: 1, type: 'Parking', amount: 120, date: '2026-07-10', notes: '' },
  { id: 3, vehicleId: 3, type: 'Fine', amount: 1500, date: '2026-07-11', notes: 'Overload penalty' },
]

let nextId = 4

// TODO: swap for real Axios calls once GET/POST /api/expenses are live.

export async function getExpenses() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return expenses

  // const { data } = await api.get('/expenses')
  // return data.data
}

export async function createExpense(payload) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const expense = {
    id: nextId++,
    ...payload,
    vehicleId: Number(payload.vehicleId),
    amount: Number(payload.amount),
  }
  expenses = [expense, ...expenses]
  return expense

  // const { data } = await api.post('/expenses', payload)
  // return data.data
}
