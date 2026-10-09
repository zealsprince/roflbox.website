import { useState, useEffect } from 'react'

export type ColorModePreference = 'light' | 'dark' | 'system'
export type ColorMode = 'light' | 'dark'

const STORAGE_KEY = 'roflbox.colorMode'

function getSystemMode(): ColorMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveMode(preference: ColorModePreference): ColorMode {
  if (preference === 'system') return getSystemMode()
  return preference
}

/** Apply data-color-mode attribute to <html>. Called both from the hook and
 *  from the FOUC-prevention inline script in index.html. */
export function applyColorMode(mode: ColorMode): void {
  document.documentElement.setAttribute('data-color-mode', mode)
}

/**
 * Manages the UI color mode (light / dark / system).
 *
 * - Persists the user's explicit choice in localStorage under `roflbox.colorMode`.
 * - Defaults to `system` (follows `prefers-color-scheme`) when no preference is
 *   stored yet.
 * - Applies `data-color-mode="light|dark"` on `document.documentElement` so that
 *   CSS token overrides in `index.css` take effect.
 */
export function useColorMode() {
  const [preference, setPreference] = useState<ColorModePreference>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
    return 'system'
  })

  const resolvedMode: ColorMode = resolveMode(preference)

  // Keep the attribute in sync whenever the resolved mode changes.
  useEffect(() => {
    applyColorMode(resolvedMode)
  }, [resolvedMode])

  // When the user's preference is "system", listen for OS-level changes.
  useEffect(() => {
    if (preference !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyColorMode(getSystemMode())
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [preference])

  const setColorMode = (pref: ColorModePreference): void => {
    setPreference(pref)
    localStorage.setItem(STORAGE_KEY, pref)
  }

  return { preference, resolvedMode, setColorMode }
}
