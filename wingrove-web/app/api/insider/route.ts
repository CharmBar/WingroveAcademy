import { NextResponse } from 'next/server'

/**
 * Become an Insider sign-up.
 * Sends each sign-up to Wingrove's OWN HubSpot account (never ElevateED's). There are no built-in IDs:
 * set HUBSPOT_PORTAL_ID and HUBSPOT_INSIDER_FORM_ID in the Wingrove Vercel project.
 * Optionally also emails the team through Resend (RESEND_API_KEY + INSIDER_NOTIFY_TO + INSIDER_FROM).
 * If nothing is configured the visitor is told sign-ups aren't open yet, so no sign-up is silently lost.
 *
 * HubSpot fields: email, firstname, lastname (standard); wingrove_role ("I am a…") and
 * inquiry_source = website_insider_signup (custom contact properties). Fields the form doesn't
 * include are dropped automatically and the submission is retried.
 */
const clean = (v: unknown, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

async function sendHubSpot(body: Record<string, string>, req: Request) {
  const portalId = process.env.HUBSPOT_PORTAL_ID
  const formId = process.env.HUBSPOT_INSIDER_FORM_ID
  if (!portalId || !formId || process.env.HUBSPOT_DISABLED === 'true') return null
  const all = [
    ['email', body.email],
    ['firstname', body.firstname],
    ['lastname', body.lastname],
    ['wingrove_role', body.role],
    ['inquiry_source', 'website_insider_signup'],
  ]
    .filter(([, v]) => v)
    .map(([name, value]) => ({ objectTypeId: '0-1', name, value }))
  const hutk = /(?:^|;\s*)hubspotutk=([^;]+)/.exec(req.headers.get('cookie') || '')?.[1]
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://wingroveacademy.ai'
  const region = process.env.HUBSPOT_REGION
  const submit = async (fields: typeof all) => {
    const payload = JSON.stringify({ fields, context: { ...(hutk ? { hutk } : {}), pageUri: `${site}${body.page || '/'}`, pageName: 'Become an Insider' } })
    const post = (host: string) =>
      fetch(`https://${host}/submissions/v3/integration/submit/${portalId}/${formId}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: payload })
    let r = await post('api.hsforms.com')
    if (r.status === 404 && region) r = await post(`api-${region}.hsforms.com`)
    return r
  }
  let fields = all
  let res = await submit(fields)
  let detail = res.ok ? '' : await res.text().catch(() => '')
  if (res.status === 400) {
    const bad = fields.map((f) => f.name).filter((n) => n !== 'email' && (detail.includes(`fields.${n}`) || detail.includes(`'${n}'`) || detail.includes(`"${n}"`)))
    if (bad.length) {
      fields = fields.filter((f) => !bad.includes(f.name))
      res = await submit(fields)
      detail = res.ok ? '' : await res.text().catch(() => '')
    }
  }
  if (!res.ok) console.error('HubSpot submission failed', res.status, detail.slice(0, 400))
  return res.ok
}

async function sendEmail(body: Record<string, string>) {
  const key = process.env.RESEND_API_KEY
  const to = process.env.INSIDER_NOTIFY_TO
  const from = process.env.INSIDER_FROM
  if (!key || !to || !from) return null
  const rows = [
    ['Name', `${body.firstname} ${body.lastname}`.trim()],
    ['Email', body.email],
    ['I am a', body.role],
  ].filter(([, v]) => v)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from,
      to: to.split(',').map((s) => s.trim()),
      reply_to: body.email,
      subject: `New Wingrove Insider: ${rows[0]?.[1] || body.email}`,
      text: rows.map(([l, v]) => `${l}: ${v}`).join('\n'),
      html: `<table style="font:15px/1.5 Arial,sans-serif">${rows.map(([l, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#5b6470">${esc(l)}</td><td>${esc(v)}</td></tr>`).join('')}</table>`,
    }),
  })
  if (!res.ok) console.error('Insider email failed', res.status)
  return res.ok
}

export async function POST(req: Request) {
  const raw = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (clean(raw?.website)) return NextResponse.json({ ok: true, message: 'Thank you. You’re on the list.' })
  const body: Record<string, string> = {}
  for (const k of ['firstname', 'lastname', 'email', 'role', 'page']) body[k] = clean(raw?.[k])
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ ok: false, message: 'Enter an email address so we can keep you posted.' }, { status: 400 })
  }
  const [hub, mail] = await Promise.all([sendHubSpot(body, req), sendEmail(body)])
  if (hub === null && mail === null) {
    return NextResponse.json({ ok: false, message: 'Sign-ups open soon. Please check back, or email info@wingroveacademy.org.' }, { status: 503 })
  }
  if (!hub && !mail) {
    return NextResponse.json({ ok: false, message: 'Sorry, that didn’t go through. Please try again.' }, { status: 502 })
  }
  return NextResponse.json({ ok: true, message: 'Thank you. You’re on the list, and we’ll be in touch as Wingrove takes shape.' })
}
