import type { Metadata } from 'next'
import { Gallery, InsiderBand, PageHero } from '@/components/Blocks'
import SitePlan from '@/components/SitePlan'
import { getCampus } from '@/lib/pages'

export const revalidate = 60
export const metadata: Metadata = { title: 'The Campus', description: 'A 43.8-acre campus in the Village of Wellington, opening Fall 2029.' }

export default async function CampusPage() {
  const c = await getCampus()
  return (
    <>
      <PageHero image={c.hero} eyebrow={c.heroEyebrow} title={c.heroTitle} lead={c.heroLead} />

      <section className="band facts">
        <div className="wrap">
          <dl className="facts__grid">
            {c.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.value}</dt>
                <dd>{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="band region">
        <div className="wrap region__grid">
          <h2 className="region__title">{c.regionTitle}</h2>
          <div>
            <hr className="rule rule--gold" />
            {c.regionBody.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="band story">
        <div className="wrap story__grid">
          <h2 className="h2">{c.storyTitle}</h2>
          <div>
            {c.storyBody.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="band planband" id="plan">
        <div className="wrap">
          <h2 className="h2">{c.planTitle}</h2>
          <hr className="rule rule--green" />
          <p className="section-lead">{c.planIntro}</p>
          <SitePlan src={c.plan.src} srcSet={c.plan.srcSet} areas={c.areas} street={c.street} />
        </div>
      </section>

      <Gallery title={c.galleryTitle} items={c.gallery} />

      <section className="band mission">
        <div className="wrap">
          <div className="mission__body">
            <p className="lead">{c.closing}</p>
          </div>
        </div>
      </section>
      <InsiderBand />
    </>
  )
}
