import type { Metadata } from 'next'
import { Gallery, InsiderBand, PageHero } from '@/components/Blocks'
import ProgramJourney from '@/components/ProgramJourney'
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
          <p className="path__sub">{l.divisionsSubtitle}</p>
          <p className="section-lead">{l.divisionsBody}</p>
          <ol className="path__cards" aria-label="School divisions in order">
            {l.divisionCards.map((d) => (
              <li key={d.name}>
                <h3>{d.name}</h3>
                <p className="path__meta">
                  Grades {d.grades} <span aria-hidden="true">·</span> {d.stage}
                </p>
                <p className="path__focus">{d.focus}</p>
                <p>{d.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ProgramJourney
        enabled={l.showPrograms}
        eyebrow={l.programsEyebrow}
        title={l.programsTitle}
        body={l.programsBody}
        programs={l.programs}
        divisions={l.divisionCards}
      />

      <section className="band time">
        <div className="wrap time__grid">
          <div className="time__text">
            <div className="eyebrow">{l.timeTitle}</div>
            <p className="time__body">{l.timeBody}</p>
            {l.rhythm.length > 0 && (
              <figure className="rhythm">
                <figcaption className="rhythm__title">{l.rhythmTitle}</figcaption>
                <div className="rhythm__bars" style={{ gridTemplateColumns: l.rhythm.map((b) => `${b.weeks}fr`).join(' ') }}>
                  {l.rhythm.map((b, k) => (
                    <div key={k} className={`rhythm__block rhythm__block--${k}`}>
                      <strong>{b.weeks} weeks</strong>
                      <span>{b.label}</span>
                    </div>
                  ))}
                </div>
                <div className="rhythm__ticks" aria-hidden="true">
                  {l.rhythm.flatMap((b, k) => Array.from({ length: Math.min(12, Math.round(b.weeks)) }, (_, w) => <i key={`${k}-${w}`} className={`rhythm__tick--${k}`} />))}
                </div>
                <div className="rhythm__details">
                  {l.rhythm.map((b, k) => (
                    <div key={k}>
                      <h3>{b.detailTitle}</h3>
                      <p>{b.detailBody}</p>
                    </div>
                  ))}
                </div>
                <p className="rhythm__caption">{l.rhythmCaption}</p>
              </figure>
            )}
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
        <img className="statement__mark" src="/brand/crest-white.png" alt="" aria-hidden="true" />
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
