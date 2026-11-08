/**
 * Password gate for the Wingrove staging site (same pattern as the ElevateED site, separate password and cookie).
 * - Password: set SITE_PASSWORD in the Wingrove Vercel project → Settings → Environment Variables, then redeploy.
 *   Until it is set, the starting password shared with the team is used (stored here only as a hash).
 * - Turn the gate off at launch: set SITE_GATE=off and redeploy.
 */
export const GATE_COOKIE = 'wa_gate'
const DEFAULT_HASH = '0d450df930c8c67d58165caf4571056054acfccbd8ca7090fea2881e3b12f42a'

export const gateEnabled = () => (process.env.SITE_GATE || '').toLowerCase() !== 'off'

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`wingrove-gate:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** The cookie value a visitor must hold to get in. */
export async function expectedToken(): Promise<string> {
  const pw = process.env.SITE_PASSWORD
  return pw ? hashPassword(pw) : DEFAULT_HASH
}
