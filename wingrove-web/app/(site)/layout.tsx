import type { Metadata } from 'next'
import { getSettings } from '@/lib/content'
import ScrollEffects from '@/components/ScrollEffects'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://wingroveacademy.ai'),
    title: { default: `${s.title} · Where Excellence Finds Purpose`, template: `%s · ${s.title}` },
    description: s.description,
    openGraph: { siteName: s.title, type: 'website', images: s.ogImage ? [s.ogImage] : ['/media/elevation-sm.webp'] },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings()
  return (
    <>
      <header className="hdr is-locked" id="hdr">
        <a href="/" aria-label={`${s.title} home`}>
          <img className="hdr__logo" id="hdrLogo" src="/brand/logo-white.png" alt={s.title} />
        </a>
        <nav className="hdr__nav" aria-label="Main">
          <a href="/#welcome">Welcome</a>
          <a href="/#distinct">Why Wingrove</a>
          <a href="/learning-experience">Learning Experience</a>
          <a href="/campus">The Campus</a>
          <a href="/visionaries">The Visionaries</a>
          <a className="btn" href="/#updates">
            {s.ctaLabel}
          </a>
        </nav>
      </header>
      <main id="top">{children}</main>
      <footer className="band foot">
        <div className="wrap">
          <div>
            <img src="/brand/logo-white.png" alt={s.title} />
            <p className="place">{s.place}</p>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--white)' }}>Questions? Contact us</p>
            <p style={{ marginTop: '.3em' }}>
              <a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a>
            </p>
            <p className="small">
              Instagram {s.instagram} &nbsp;·&nbsp; LinkedIn {s.linkedin}
            </p>
            <p className="small">Privacy Policy</p>
          </div>
          <div className="answerer" aria-labelledby="answerer-title">
            <div className="answerer__head">
              <p className="answerer__title" id="answerer-title">
                {s.answererTitle}
              </p>
              <span className="answerer__badge">{s.answererStatus}</span>
            </div>
            <p className="answerer__text">{s.answererText}</p>
            {/* Placeholder only: the Q&A service isn't connected yet */}
            <div className="answerer__box" aria-hidden="true">
              <span>Ask a question about Wingrove…</span>
              <span className="answerer__send">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </footer>
      <ScrollEffects />
    </>
  )
}
