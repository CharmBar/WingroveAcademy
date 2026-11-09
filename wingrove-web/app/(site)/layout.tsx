import type { Metadata } from 'next'
import { getSettings } from '@/lib/content'
import ScrollEffects from '@/components/ScrollEffects'
import MobileMenu from '@/components/MobileMenu'

const LINKS = [
  { href: '/#welcome', label: 'Welcome' },
  { href: '/#distinct', label: 'Why Wingrove' },
  { href: '/learning-experience', label: 'Learning Experience' },
  { href: '/campus', label: 'The Campus' },
  { href: '/visionaries', label: 'The Visionaries' },
]

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
          {LINKS.map((l) => (
            <a key={l.href} className="hdr__link" href={l.href}>
              {l.label}
            </a>
          ))}
          <a className="btn hdr__cta" href="/#updates">
            {s.ctaLabel}
          </a>
        </nav>
        <MobileMenu links={LINKS} cta={{ href: '/#updates', label: s.ctaLabel }} />
      </header>
      <main id="top">{children}</main>
      <footer className="band foot">
        <div className="wrap">
          <div>
            <img src="/brand/logo-white.png" alt={s.title} />
            <p className="place">{s.place}</p>
          </div>
          <div className="answerer" aria-labelledby="answerer-title">
            <p className="answerer__title" id="answerer-title">
              {s.answererTitle}
            </p>
            <p className="answerer__text">{s.answererText}</p>
            {/* The Q&A service isn't open yet */}
            <p className="answerer__soon">
              {s.answererStatus}
              <svg className="answerer__chev" viewBox="0 0 22 20" aria-hidden="true">
                <path d="M3 3l7 7-7 7M11 3l7 7-7 7" />
              </svg>
            </p>
          </div>
          <div>
            <p className="foot__head">Questions? Contact us</p>
            <p style={{ marginTop: '.3em' }}>
              <a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a>
            </p>
            <p className="small">
              Instagram {s.instagram} &nbsp;·&nbsp; LinkedIn {s.linkedin}
            </p>
            <p className="small">Privacy Policy</p>
          </div>
        </div>
      </footer>
      <ScrollEffects />
    </>
  )
}
