import type { Metadata } from 'next'
import { InsiderBand, PageHero } from '@/components/Blocks'
import QuoteCarousel from '@/components/QuoteCarousel'
import { getHome } from '@/lib/content'
import { getWhy } from '@/lib/pages'

export const revalidate = 60
export const metadata: Metadata = {
  title: 'Why Wingrove',
  description: 'What makes Wingrove Academy distinctive: ten commitments that shape the school.',
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * Why Wingrove: the ten distinctions from the home page carousel, laid out in full. The home page
 * owns the content (Studio → Home page → What Makes Wingrove Distinctive), so the two always match.
 */
export default async function WhyWingrovePage() {
  const [w, h] = await Promise.all([getWhy(), getHome()])
  const items = h.pillars.map((p, i) => ({ ...p, id: slug(p.label) || `distinction-${i + 1}`, n: String(i + 1).padStart(2, '0') }))
  const mid = Math.ceil(items.length / 2)

  const Row = ({ p, k }: { p: (typeof items)[number]; k: number }) => (
    <article className={`why__row${k % 2 ? ' why__row--flip' : ''}`} id={p.id}>
      <div className="why__media">
        <img src={p.src} srcSet={p.srcSet} sizes="(max-width:880px) 92vw, 58vw" alt={p.alt} loading={k < 2 ? 'eager' : 'lazy'} />
      </div>
      <div className="why__text">
        <div className="why__n">
          {p.n} <span>/ {String(items.length).padStart(2, '0')}</span>
        </div>
        <h2>{p.label}</h2>
        <hr className="rule rule--green" />
        <p>{p.body}</p>
      </div>
    </article>
  )

  return (
    <>
      <PageHero image={w.hero} eyebrow={w.heroEyebrow} title={w.heroTitle || h.distinctTitle} lead={w.heroLead || h.distinctIntro} />

      <section className="band why-index">
        <div className="wrap">
          <div className="eyebrow">{w.indexTitle}</div>
          <ol className="why-index__list">
            {items.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`}>
                  <span className="why-index__n">{p.n}</span>
                  <span>{p.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band why" aria-label={h.distinctTitle}>
        <div className="wrap">
          {items.slice(0, mid).map((p, k) => (
            <Row key={p.id} p={p} k={k} />
          ))}
        </div>
      </section>

      <QuoteCarousel quotes={[{ quote: h.visionQuote, attribution: `${h.visionName}, ${h.visionRole}` }]} image="/media/leaf.webp" />

      <section className="band why">
        <div className="wrap">
          {items.slice(mid).map((p, k) => (
            <Row key={p.id} p={p} k={mid + k} />
          ))}
        </div>
      </section>

      <InsiderBand />
    </>
  )
}
