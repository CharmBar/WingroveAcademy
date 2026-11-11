import type { Metadata } from 'next'
import { PageHero } from '@/components/Blocks'
import InsiderForm from '@/components/InsiderForm'
import QuoteCarousel from '@/components/QuoteCarousel'
import CountUp from '@/components/CountUp'
import { PersonCard } from '@/components/Person'
import { getGiving, getPeople, getTeam } from '@/lib/pages'

export const revalidate = 60
export const metadata: Metadata = {
  title: 'Giving',
  description: 'Help shape an enduring institution: founding philanthropy at Wingrove Academy.',
}

/** Giving: in the top navigation, and linked from the Advancement band on The Visionaries. */
export default async function GivingPage() {
  const [g, t, people] = await Promise.all([getGiving(), getTeam(), getPeople()])
  const advancement = people.filter((p) => p.group === 'advancement')
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

      <QuoteCarousel quotes={g.quotes} image={g.quotesImage} />

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
                <strong>{s.countUp ? <CountUp value={s.value} /> : s.value}</strong>
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
              <li>{g.otherBody}</li>
            </ul>
          </div>
          <InsiderForm button={g.formButton} defaultInterests={['Capital Campaign']} showPhone />
        </div>
      </section>
      {advancement.length > 0 && (
        <section className="band team" id="advancement">
          <div className="wrap">
            <h2 className="h2">{g.teamTitle || t.advancementTitle}</h2>
            <hr className="rule rule--green" />
            <p className="section-lead">{g.teamIntro || t.advancementIntro}</p>
            <div className="team__grid">
              {advancement.map((p) => (
                <PersonCard key={p.slug} p={p} section="advancement" />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
