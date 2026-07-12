import { createContext, useContext, useState } from 'react'
import { ROLES } from '../utils/roles.js'

const AuthContext = createContext(null)

// TODO: replace with a real call once POST /api/auth/login exists on the
// server (server/src/controllers/auth.controller.js is still an empty stub).
// Expected real shape, based on server/database/schema.sql (users + roles
// tables): { user: { id, name, email }, role: 'Fleet Manager', token }
async function mockLoginRequest({ email, password, roleId }) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (!email || !password) {
    throw new Error('Email and password are required.')
  }

  const role = ROLES.find((r) => r.id === roleId)

  return {
    user: { id: 1, name: email.split('@')[0], email },
    role: role?.label ?? ROLES[0].label,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)

  const login = async ({ email, password, roleId }) => {
    const data = await mockLoginRequest({ email, password, roleId })
    setUser(data.user)
    setRole(data.role)
    return data
  }

  const logout = () => {
    setUser(null)
    setRole(null)
  }

  const value = {
    user,
    role,
    isLoggedIn: Boolean(user),
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
