import axios from 'axios'

export const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  // Without this, a request that genuinely hangs (e.g. the backend is up
  // but a query is stuck) never rejects at all — the .catch() error
  // handling on each page can't do anything if the promise never settles.
  timeout: 15000,
})

// Attach the JWT (stored by AuthContext) to every request once the backend
// auth endpoint is live.
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('transitops_auth')
  if (stored) {
    const { token } = JSON.parse(stored)
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// A 401 on any authenticated request means the stored token is invalid or
// expired — clear the stale session and bounce to Login instead of leaving
// the app stuck showing a "logged in" shell that can't load any data.
// Login/Register themselves also return 401/400 for wrong credentials, so
// those are excluded — that's a form error, not an expired session.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.startsWith('/auth/')
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('transitops_auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
