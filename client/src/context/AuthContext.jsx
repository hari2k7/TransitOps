import { createContext, useContext, useState } from 'react'
import * as authService from '../services/authService.js'

const AuthContext = createContext(null)

const STORAGE_KEY = 'transitops_auth'

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

  // Role now comes back from the backend (tied to the account, not
  // something the user picks at login) — real JWT, not the old
  // client-side 'mock-jwt-token' that every API call used to reject.
  const login = async ({ email, password }) => {
    const { token, user } = await authService.login(email, password)
    const nextAuth = { user, token }
    setAuth(nextAuth)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth))
    return { token, user }
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
