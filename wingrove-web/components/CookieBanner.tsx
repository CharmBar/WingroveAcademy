'use client'

import { useEffect, useState } from 'react'
import { CONSENT_KEY, OPEN_PREFS_EVENT, setConsent } from '@/lib/consent'

/** Small consent banner (as on the ElevateED site). Shown until the visitor chooses; reopened from "Cookie preferences" in the footer. */
export default function CookieBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(CONSENT_KEY)
    } catch {}
    if (!saved) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_PREFS_EVENT, reopen)
    return () => window.removeEventListener(OPEN_PREFS_EVENT, reopen)
  }, [])

  if (!open) return null
  const choose = (c: 'granted' | 'denied') => {
    setConsent(c)
    setOpen(false)
  }

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie preferences">
      <p>
        We use cookies to understand how people use this site and to improve it. <a href="/privacy-policy">Privacy policy</a>
      </p>
      <div className="cookie-actions">
        <button type="button" className="cookie-btn cookie-btn--ghost" onClick={() => choose('denied')}>
          Decline
        </button>
        <button type="button" className="btn" onClick={() => choose('granted')}>
          Accept
        </button>
      </div>
    </div>
  )
}

export function CookiePrefsLink() {
  return (
    <button type="button" className="link-button" onClick={() => window.dispatchEvent(new Event(OPEN_PREFS_EVENT))}>
      Cookie preferences
    </button>
  )
}
