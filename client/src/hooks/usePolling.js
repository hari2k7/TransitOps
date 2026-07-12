import { useEffect, useRef } from 'react'

const DEFAULT_INTERVAL_MS = 20000

// Re-runs `callback` on an interval for as long as the calling page is
// mounted. Two things it deliberately does NOT do naively:
// - Poll a hidden tab: paused while document.visibilityState !== 'visible',
//   so backgrounded tabs don't keep hammering the API.
// - Wait out a full interval after the tab comes back: refreshes
//   immediately on visibilitychange so data isn't stale when you tab back in.
//
// The page's own fetch function is responsible for NOT flashing a loading
// spinner or blocking error screen on a background refresh — pass it a
// `silent` flag (see Dashboard.jsx / Vehicles.jsx etc. for the pattern).
export function usePolling(callback, { intervalMs = DEFAULT_INTERVAL_MS, enabled = true } = {}) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!enabled) return undefined

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        callbackRef.current()
      }
    }, intervalMs)

    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        callbackRef.current()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [intervalMs, enabled])
}
