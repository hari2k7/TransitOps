import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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

export default api
