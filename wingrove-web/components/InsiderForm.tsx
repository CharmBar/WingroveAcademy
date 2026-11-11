'use client'

import { useEffect, useState } from 'react'

/**
 * Interests shown on the site, each mapped to the value Wingrove's HubSpot form already uses
 * (field "please_select_the_areas_you_are_interested_in"), so existing workflows keep working.
 * Change a label freely; change a value only if it is changed in HubSpot too.
 */
export const INTERESTS = [
  { label: 'Philanthropy & Giving', value: 'Capital Campaign' },
  { label: 'Community Involvement', value: 'Donations' },
  { label: 'Admissions & Enrollment', value: 'Educational Interest' },
  { label: 'Careers & Opportunities', value: 'Employment Interest' },
  { label: 'News & Updates', value: 'News Updates' },
] as const

/** Become an Insider sign-up. Posts to /api/insider, which forwards to Wingrove's own HubSpot form. */
export default function InsiderForm({ button, defaultInterests = ['News Updates'] }: { button: string; defaultInterests?: string[] }) {
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [picked, setPicked] = useState<string[]>(defaultInterests)

  // ?interest=donor (from the giving links) pre-selects Philanthropy & Giving
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('interest') === 'donor') setPicked((p) => Array.from(new Set(['Capital Campaign', ...p.filter((v) => v !== 'News Updates')])))
  }, [])

  const toggle = (v: string) => setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    if (!data.firstname?.trim() || !data.lastname?.trim()) {
      setMsg('Please add your first and last name.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '')) {
      setMsg('Enter an email address so we can keep you posted.')
      return
    }
    if (!picked.length) {
      setMsg('Choose at least one area you’re interested in.')
      return
    }
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch('/api/insider', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ firstname: data.firstname, lastname: data.lastname, email: data.email, message: data.message, website: data.website, interests: picked, page: window.location.pathname }),
      })
      const out = await res.json().catch(() => ({}))
      if (res.ok && out.ok) {
        setMsg('')
        setDone(true)
      } else setMsg(out.message || 'Something went wrong. Please try again.')
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
        <input id="f-first" name="firstname" autoComplete="given-name" required disabled={done} />
      </label>
      <label htmlFor="f-last">
        Last name
        <input id="f-last" name="lastname" autoComplete="family-name" required disabled={done} />
      </label>
      <label className="full" htmlFor="f-email">
        Email
        <input id="f-email" name="email" type="email" autoComplete="email" required disabled={done} />
      </label>
      <fieldset className="full form__interests" disabled={done}>
        <legend>I’m interested in</legend>
        {INTERESTS.map((o) => (
          <label key={o.value} className="form__check">
            <input type="checkbox" name="interests" value={o.value} checked={picked.includes(o.value)} onChange={() => toggle(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </fieldset>
      <label className="full" htmlFor="f-message">
        <span>
          Message <span className="form__optional">(optional)</span>
        </span>
        <textarea id="f-message" name="message" rows={3} maxLength={2000} placeholder="Anything you’d like us to know" disabled={done} />
      </label>
      <div className="form__hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="btn" type="submit" disabled={busy || done}>
        {busy ? 'Sending…' : button}
      </button>
      <div className="form__msg" id="formMsg" role="status">
        {done ? (
          <div className="form__thanks">
            <strong>You’re in. Welcome to Wingrove Insiders.</strong>
            <p>You’ll be among the first to see Wingrove Academy come to life as our vision takes shape. We’re excited to have you join us on this journey.</p>
          </div>
        ) : (
          msg
        )}
      </div>
    </form>
  )
}
