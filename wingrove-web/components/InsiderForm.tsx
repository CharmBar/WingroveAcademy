'use client'

import { useEffect, useState } from 'react'

const ROLES = ['Prospective family', 'Donor or partner', 'Prospective faculty or staff', 'Member of the community']

/** Become an Insider sign-up. Posts to /api/insider, which forwards to Wingrove's own HubSpot form. */
export default function InsiderForm({ button, defaultRole }: { button: string; defaultRole?: string }) {
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [role, setRole] = useState(defaultRole && ROLES.includes(defaultRole) ? defaultRole : ROLES[0])

  // ?interest=donor (from "Shape the Future of the School") pre-selects Donor or partner
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('interest') === 'donor') setRole('Donor or partner')
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '')) {
      setMsg('Enter an email address so we can keep you posted.')
      return
    }
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch('/api/insider', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, page: window.location.pathname }),
      })
      const out = await res.json().catch(() => ({}))
      setMsg(out.message || (res.ok ? 'Thank you. You’re on the list.' : 'Something went wrong. Please try again.'))
      if (res.ok && out.ok) setDone(true)
    } catch {
      setMsg('We couldn’t reach the server. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="form" id="form" noValidate onSubmit={onSubmit}>
      <label htmlFor="f-first">
        First name
        <input id="f-first" name="firstname" autoComplete="given-name" disabled={done} />
      </label>
      <label htmlFor="f-last">
        Last name
        <input id="f-last" name="lastname" autoComplete="family-name" disabled={done} />
      </label>
      <label className="full" htmlFor="f-email">
        Email
        <input id="f-email" name="email" type="email" autoComplete="email" disabled={done} />
      </label>
      <label className="full" htmlFor="f-role">
        I am a
        <select id="f-role" name="role" disabled={done} value={role} onChange={(e) => setRole(e.target.value)}>
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>
      <div className="form__hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="btn" type="submit" disabled={busy || done}>
        {busy ? 'Sending…' : button}
      </button>
      <p className="form__msg" id="formMsg" role="status">
        {msg}
      </p>
    </form>
  )
}
