import { useCallback, useEffect, useRef, useState } from 'react'
import { API_BASE_URL } from '../services/api.js'

// Two different failure modes look identical to a page (axios just throws
// "Network Error" either way), but they mean different things to a user:
// - 'offline'            -> their device has no network at all
// - 'server-unreachable' -> they're online, but localhost:5000 isn't
//                           answering (backend not started / crashed)
// 'checking' is the brief state while the first health probe is in flight.
const POLL_INTERVAL_MS = 15000
const PROBE_TIMEOUT_MS = 4000

// Shared copy so Login/Register and the in-app ConnectionGate say the same
// thing for the same status.
export const CONNECTION_MESSAGES = {
  offline: {
    title: 'No internet connection',
    message: "Your device isn't connected to the internet right now. Check your Wi-Fi or data connection and try again.",
  },
  'server-unreachable': {
    title: "Can't reach the TransitOps server",
    message: "You're online, but the backend isn't responding. It may still be starting up, or it isn't running.",
  },
}

async function probeServer() {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)

  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

export function useConnectionStatus() {
  const [status, setStatus] = useState('checking')
  const mountedRef = useRef(true)

  const checkNow = useCallback(async () => {
    if (!navigator.onLine) {
      if (mountedRef.current) setStatus('offline')
      return
    }
    const reachable = await probeServer()
    if (mountedRef.current) setStatus(reachable ? 'online' : 'server-unreachable')
  }, [])

  useEffect(() => {
    mountedRef.current = true
    checkNow()

    const handleOnline = () => checkNow()
    const handleOffline = () => setStatus('offline')

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    const interval = setInterval(checkNow, POLL_INTERVAL_MS)

    return () => {
      mountedRef.current = false
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [checkNow])

  return { status, checkNow }
}
