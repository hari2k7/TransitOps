import { createContext, useContext, useState } from 'react'
import { ROLES } from '../utils/roles.js'

const AuthContext = createContext(null)

const STORAGE_KEY = 'transitops_auth'

// TODO: replace with a real Axios call to POST /api/auth/login once the
// server endpoint is live (server/src/controllers/auth.controller.js).
// Matches the contract from the backend team's guide:
// request  { email, password }
// response { success, token, user: { id, name, role } }
async function mockLoginRequest({ email, password, roleId }) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (!email || !password) {
    throw new Error('Email and password are required.')
  }

  const role = ROLES.find((r) => r.id === roleId)

  return {
    success: true,
    token: 'mock-jwt-token',
    user: {
      id: 1,
      name: email.split('@')[0],
      role: role?.label ?? ROLES[0].label,
    },
  }
}

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadStoredAuth)

  const login = async ({ email, password, roleId }) => {
    const data = await mockLoginRequest({ email, password, roleId })
    const nextAuth = { user: data.user, token: data.token }
    setAuth(nextAuth)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth))
    return data
  }

  const logout = () => {
    setAuth(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = {
    user: auth?.user ?? null,
    role: auth?.user?.role ?? null,
    token: auth?.token ?? null,
    isLoggedIn: Boolean(auth?.user),
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
