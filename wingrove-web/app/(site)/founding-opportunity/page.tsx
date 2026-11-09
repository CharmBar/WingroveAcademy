import type { Metadata } from 'next'
import { PageHero } from '@/components/Blocks'
import InsiderForm from '@/components/InsiderForm'
import { getGiving } from '@/lib/pages'

export const revalidate = 60
export const metadata: Metadata = {
  title: 'A Founding Opportunity',
  description: 'Help shape an enduring institution: founding philanthropy at Wingrove Academy.',
  robots: { index: false, follow: false },
}

/** Donor page. Not in the navigation: reached from the Advancement band on The Visionaries. */
export default async function FoundingOpportunityPage() {
  const g = await getGiving()
  return (
    <>
      <PageHero image={g.hero} eyebrow={g.heroEyebrow} title={g.heroTitle} lead={g.heroLead} />

      <section className="band found-intro">
        <div className="wrap">
          {g.intro.map((p, i) => (
            <p key={i} className={i === 0 ? 'found-intro__lead' : undefined}>
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="band found-support">
        <div className="wrap found-support__grid">
          <div className="found-support__img">
            <img src={g.supportImage.src} srcSet={g.supportImage.srcSet} sizes="(max-width:880px) 92vw, 46vw" alt={g.supportImage.alt} loading="lazy" />
          </div>
          <div>
            <h2 className="h2">{g.supportTitle}</h2>
            <hr className="rule rule--gold" />
            <dl className="found-support__items">
              {g.supportItems.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="band found-stats">
        <img className="found-stats__bg" src={g.statsImage.src} srcSet={g.statsImage.srcSet} sizes="100vw" alt="" aria-hidden="true" loading="lazy" />
        <div className="wrap">
          <h2 className="h2">{g.statsTitle}</h2>
          <hr className="rule rule--gold" />
          <ul className="found-stats__list">
            {g.stats.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band updates" id="give">
        <div className="wrap">
          <div>
            <div className="eyebrow">{g.giftEyebrow}</div>
            <h3>{g.giftTitle}</h3>
            <p className="sub">{g.giftSubtitle}</p>
            <p>{g.giftBody}</p>
            <ul className="perks">
              {g.giftPerks.map((p) => (
                <li key={p}>{p}</li>
              ))}
              <li>
                {g.otherBody} <a href={`mailto:${g.otherEmail}?subject=${encodeURIComponent('Founding gift to Wingrove Academy')}`}>{g.otherLinkLabel}</a>.
              </li>
            </ul>
          </div>
          <InsiderForm button={g.formButton} defaultRole="Donor or partner" />
        </div>
      </section>
    </>
  )
}
