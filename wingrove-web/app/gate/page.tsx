import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wingrove Academy · Preview access',
  robots: { index: false, follow: false },
}

export default async function GatePage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next = '/', error } = await searchParams
  return (
    <main className="gate">
      <img className="gate-bg" src="/media/elevation-sm.webp" alt="" aria-hidden="true" />
      <div className="gate-card">
        <img src="/brand/logo-navy.png" alt="Wingrove Academy" className="gate-logo" />
        <p className="gate-eyebrow">Private preview</p>
        <h1 className="gate-title">The new Wingrove Academy site is coming soon.</h1>
        <p className="gate-text">Enter the preview password to continue.</p>
        <form method="post" action="/api/gate" className="gate-form">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="gate-pw" className="sr">
            Password
          </label>
          <input id="gate-pw" name="password" type="password" autoComplete="current-password" placeholder="Password" required autoFocus aria-invalid={error ? true : undefined} aria-describedby={error ? 'gate-err' : undefined} />
          <button type="submit">Enter</button>
        </form>
        {error && (
          <p id="gate-err" className="gate-error" role="alert">
            That password didn’t work. Please try again.
          </p>
        )}
      </div>
    </main>
  )
}
