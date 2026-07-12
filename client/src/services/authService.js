import api from './api.js'

// GET /api/auth/roles — public, used to populate the Register form's role
// dropdown with real DB-backed role_id values (no auth-token dependency,
// since the user doesn't have one yet at this point).
export async function getRoles() {
  const { data } = await api.get('/auth/roles')
  return data.data // [{ id, role_name }]
}

// POST /api/auth/login -> { success, message, token, user: { id, name, email, role } }
export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  return { token: data.token, user: data.user }
}

// POST /api/auth/register -> { success, message, data: { id, name, email, role_id, created_at } }
export async function register({ name, email, password, roleId }) {
  const { data } = await api.post('/auth/register', {
    name,
    email,
    password,
    role_id: roleId,
  })
  return data.data
}
