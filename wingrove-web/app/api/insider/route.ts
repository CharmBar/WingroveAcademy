import { NextResponse } from 'next/server'

/**
 * Become an Insider sign-up.
 * Sends each sign-up to Wingrove's OWN HubSpot account 242324058 (never ElevateED's 247877716).
 * Form: "Become an Insider" (d146e057…), region na2. HUBSPOT_INSIDER_FORM_ID / HUBSPOT_REGION override these.
 * Optionally also emails the team through Resend (RESEND_API_KEY + INSIDER_NOTIFY_TO + INSIDER_FROM).
 * If nothing is configured the visitor is told sign-ups aren't open yet, so no sign-up is silently lost.
 *
 * HubSpot fields: email, firstname, lastname, and please_select_the_areas_you_are_interested_in
 * (checkboxes, sent as HubSpot's stored values joined with ";"). Only values the form defines are sent.
 * Fields the form rejects are dropped automatically and the submission is retried.
 */
const clean = (v: unknown, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const WINGROVE_PORTAL = '242324058'
const WINGROVE_FORM = 'd146e057-b4ba-45c3-8218-7bba2b8b2f79'
const WINGROVE_REGION = 'na2'
const INTEREST_FIELD = 'please_select_the_areas_you_are_interested_in'
const INTEREST_VALUES = ['Capital Campaign', 'Donations', 'Educational Interest', 'Employment Interest', 'News Updates']

async function sendHubSpot(body: Record<string, string>, req: Request) {
  // Wingrove Academy's HubSpot account. A guard stops ElevateED's account being used here by mistake.
  const portalId = process.env.HUBSPOT_PORTAL_ID || WINGROVE_PORTAL
  if (portalId === '247877716') {
    console.error('HUBSPOT_PORTAL_ID is set to the ElevateED account; Wingrove sign-ups were not sent.')
    return false
  }
  const formId = process.env.HUBSPOT_INSIDER_FORM_ID || WINGROVE_FORM
  if (!portalId || !formId || process.env.HUBSPOT_DISABLED === 'true') return null
  const all = [
    ['email', body.email],
    ['firstname', body.firstname],
    ['lastname', body.lastname],
    [INTEREST_FIELD, body.interests],
    ['message', body.message],
  ]
    .filter(([, v]) => v)
    .map(([name, value]) => ({ objectTypeId: '0-1', name: name as string, value: value as string }))
  const hutk = /(?:^|;\s*)hubspotutk=([^;]+)/.exec(req.headers.get('cookie') || '')?.[1]
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://wingroveacademy.ai'
  const region = process.env.HUBSPOT_REGION ?? WINGROVE_REGION
  const submit = async (fields: typeof all) => {
    const payload = JSON.stringify({ fields, context: { ...(hutk ? { hutk } : {}), pageUri: `${site}${body.page || '/'}`, pageName: 'Become an Insider' } })
    const post = (host: string) =>
      fetch(`https://${host}/submissions/v3/integration/submit/${portalId}/${formId}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: payload })
    // The account is hosted in na2, so try its regional host first, then the global one
    let r = await post(region ? `api-${region}.hsforms.com` : 'api.hsforms.com').catch(() => null)
    if ((!r || r.status === 404) && region) r = await post('api.hsforms.com').catch(() => null)
    return r ?? new Response('HubSpot could not be reached', { status: 502 })
  }
  let fields = all
  let res = await submit(fields)
  let detail = res.ok ? '' : await res.text().catch(() => '')
  if (res.status === 400) {
    const bad = fields.map((f) => f.name).filter((n) => n !== 'email' && (detail.includes(`fields.${n}`) || detail.includes(`'${n}'`) || detail.includes(`"${n}"`)))
    if (bad.length && !bad.includes(INTEREST_FIELD)) {
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
    ['Interested in', body.interestLabels],
    ['Message', body.message],
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
  for (const k of ['firstname', 'lastname', 'email', 'page']) body[k] = clean(raw?.[k])
  body.message = clean(raw?.message, 2000)
  const picked = Array.isArray(raw?.interests) ? (raw!.interests as unknown[]).filter((v): v is string => typeof v === 'string' && INTEREST_VALUES.includes(v)) : []
  body.interests = Array.from(new Set(picked)).join(';')
  body.interestLabels = Array.from(new Set(picked)).join(', ')
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
  return NextResponse.json({ ok: true, message: 'You’re in. Welcome to Wingrove Insiders.' })
}
