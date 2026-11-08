import { NextResponse, type NextRequest } from 'next/server'
import { GATE_COOKIE, expectedToken, gateEnabled } from '@/lib/gate'

/** Sends visitors without the access cookie to /gate while the site is pre-launch. */
export async function proxy(req: NextRequest) {
  if (!gateEnabled()) return NextResponse.next()
  const token = req.cookies.get(GATE_COOKIE)?.value
  if (token && token === (await expectedToken())) {
    const res = NextResponse.next()
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return res
  }
  const url = req.nextUrl.clone()
  const next = req.nextUrl.pathname + req.nextUrl.search
  url.pathname = '/gate'
  url.search = next && next !== '/' ? `?next=${encodeURIComponent(next)}` : ''
  return NextResponse.redirect(url)
}

export const config = {
  // Everything except the gate itself, the Studio (it has its own Sanity login), Next.js files and the gate's own images.
  matcher: ['/((?!gate|api/gate|studio|_next/|favicon\\.ico|icon\\.png|apple-icon\\.png|robots\\.txt|brand/|media/elevation-sm\\.webp).*)'],
}
