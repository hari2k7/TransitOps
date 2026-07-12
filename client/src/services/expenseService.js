import api from './api.js'

// type -> expense_type, date -> log_date, notes -> description are renames,
// not just case changes.
function toApiPayload(expense) {
  return {
    vehicle_id: Number(expense.vehicleId),
    expense_type: expense.type,
    amount: Number(expense.amount),
    log_date: expense.date,
    description: expense.notes || '',
  }
}

function fromApiRow(row) {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    type: row.expense_type,
    amount: Number(row.amount),
    date: row.log_date,
    notes: row.description || '',
  }
}

export async function getExpenses() {
  const { data } = await api.get('/expenses')
  return data.data.map(fromApiRow)
}

export async function createExpense(payload) {
  const { data } = await api.post('/expenses', toApiPayload(payload))
  return fromApiRow(data.data)
}
