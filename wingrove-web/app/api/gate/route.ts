import { NextResponse } from 'next/server'
import { GATE_COOKIE, expectedToken, hashPassword } from '@/lib/gate'

export async function POST(req: Request) {
  const form = await req.formData()
  const password = String(form.get('password') || '')
  const nextRaw = String(form.get('next') || '/')
  const next = nextRaw.startsWith('/') && !nextRaw.startsWith('//') ? nextRaw : '/'
  const origin = new URL(req.url).origin

  if (password && (await hashPassword(password)) === (await expectedToken())) {
    const res = NextResponse.redirect(new URL(next, origin), 303)
    res.cookies.set(GATE_COOKIE, await hashPassword(password), {
      httpOnly: true,
      secure: origin.startsWith('https'),
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    return res
  }
  const back = new URL('/gate', origin)
  back.searchParams.set('error', '1')
  if (next !== '/') back.searchParams.set('next', next)
  return NextResponse.redirect(back, 303)
}
