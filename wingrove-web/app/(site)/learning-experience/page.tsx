import type { Metadata } from 'next'
import { Gallery, InsiderBand, PageHero } from '@/components/Blocks'
import { getLearning } from '@/lib/pages'

export const revalidate = 60
export const metadata: Metadata = { title: 'The Learning Experience', description: 'Wingrove’s original PK–12 curriculum, school model, and calendar.' }

export default async function LearningPage() {
  const l = await getLearning()
  return (
    <>
      <PageHero image={l.hero} eyebrow={l.heroEyebrow} title={l.heroTitle} lead={l.heroLead} />

      <section className="band mission">
        <div className="wrap">
          <div className="mission__body">
            <p className="lead">{l.introLead}</p>
            <hr className="rule" />
            <p>{l.introBody}</p>
          </div>
        </div>
      </section>

      <section className="band path">
        <div className="wrap">
          <h2 className="h2">{l.divisionsTitle}</h2>
          <hr className="rule rule--green" />
          <p className="section-lead">{l.divisionsBody}</p>
          <ol className="path__steps" aria-label="School divisions in order">
            {l.divisions.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ol>
          <div className="path__ends" aria-hidden="true">
            <span>{l.divisionsFrom}</span>
            <span>{l.divisionsTo}</span>
          </div>
        </div>
      </section>

      <section className="band time">
        <div className="wrap time__grid">
          <div className="time__text">
            <div className="eyebrow">{l.timeTitle}</div>
            <p className="time__body">{l.timeBody}</p>
            <ul className="time__items">
              {l.timeItems.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="time__note">{l.timeNote}</p>
          </div>
          <div className="time__img">
            <img src={l.timeImage.src} srcSet={l.timeImage.srcSet} sizes="(max-width:880px) 92vw, 45vw" alt={l.timeImage.alt} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="band third">
        <div className="wrap">
          <h2 className="h2">{l.thirdTitle}</h2>
          <hr className="rule rule--green" />
          <p className="section-lead">{l.thirdBody}</p>
          <div className="third__grid">
            {l.thirdItems.map((t) => (
              <div className="third__item" key={t.label}>
                <h3>{t.label}</h3>
                <p>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band statement">
        <div className="wrap">
          <div className="eyebrow">{l.curriculumTitle}</div>
          <p className="statement__text">{l.curriculumBody}</p>
          <p className="statement__note">{l.scaleBody}</p>
        </div>
      </section>

      <Gallery title={l.galleryTitle} items={l.gallery} />
      <InsiderBand />
    </>
  )
}
