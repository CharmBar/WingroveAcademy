import InsiderForm from '@/components/InsiderForm'
import PillarCarousel from '@/components/PillarCarousel'
import ScrollCue from '@/components/ScrollCue'
import { getHome, media } from '@/lib/content'
import { imageUrl } from '@/lib/sanity'

export const revalidate = 60

export default async function Home() {
  const h = await getHome()
  const heroUpload = imageUrl(h.heroImage, 7400)
  const [sceneA, sceneB] = h.scenes
  const a = media(sceneA?.image, sceneA?.fallback || 'courtyard', 3000)
  const b = media(sceneB?.image, sceneB?.fallback || 'commons', 3000)
  const visionBg = imageUrl(h.visionImage, 1600) || '/media/leaf.webp'
  return (
    <>
      <section className="stage" id="stage" aria-label="Welcome to Wingrove Academy">
        {/* The opening's words are drawn as animated layers (hidden from screen readers); this is the readable version. */}
        <div className="sr">
          <h1>
            Wingrove Academy: {h.tagline}
          </h1>
          <p>{h.openingLine}</p>
          <p>{h.closingLine}</p>
        </div>
        <div className="stage__pin">
          <img
            className="stage__img intro-bright"
            id="elev"
            src={heroUpload || '/media/elevation.webp'}
            srcSet={heroUpload ? undefined : '/media/elevation-sm.webp 1600w, /media/elevation.webp 3800w, /media/elevation-xl.webp 7380w'}
            sizes="300vw"
            fetchPriority="high"
            alt={h.heroImage?.alt || 'Rendering of the Wingrove Academy campus front elevation at dusk, with the timber entrance beneath a white canopy and an observatory dome to the right'}
          />
          <img className="stage__scene stage__scene--a" src={a.src} srcSet={a.srcSet} sizes="120vw" alt="" decoding="async" />
          <img className="stage__scene stage__scene--b" src={b.src} srcSet={b.srcSet} sizes="120vw" alt="" decoding="async" />
          <div className="stage__shade" id="shade" />

          <div className="lockup" id="lockup">
            <img className="lockup__crest intro-fade" id="crest" src="/brand/crest-white.svg" alt="" />
            <div className="lockup__word intro-fade intro-fade--late" role="img" aria-label="Wingrove Academy">
              <img className="w1" src="/brand/wingrove-white.png" alt="" />
              <img className="w2" src="/brand/academy-white.png" alt="" />
            </div>
            <div className="lockup__date intro-fade intro-fade--late">
              {h.openingLine.split(/\s+·\s+/).map((part, i) => (
                <span key={i}>
                  {i > 0 && <span className="lockup__sep"> · </span>}
                  <span className="lockup__part">{part}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="line line--a" aria-hidden="true">
            {h.taglineEyebrow && <p>{h.taglineEyebrow}</p>}
            <h2>{h.tagline}</h2>
          </div>

          <div className="scap" aria-hidden="true">
            <span className="scap__a">{sceneA?.caption}</span>
            <span className="scap__b">{sceneB?.caption}</span>
          </div>
          <div className="stage__veil" id="veil" />
          <div className="line line--b" aria-hidden="true">
            <h2>{h.closingLine}</h2>
            <p>Opening Fall 2029</p>
          </div>

          <ScrollCue />
        </div>
      </section>

      <section className="band mission" id="welcome" tabIndex={-1}>
        <div className="wrap">
          <div className="mission__body">
            <p className="lead">{h.welcomeLead}</p>
            <hr className="rule" />
            <p>{h.welcomeBody}</p>
            <p className="note">{h.welcomeNote}</p>
          </div>
        </div>
      </section>

      <section className="band distinct" id="distinct">
        <div className="wrap">
          <h3>{h.distinctTitle}</h3>
          <hr className="rule rule--green" />
          <p className="distinct__lead">{h.distinctIntro}</p>
          <PillarCarousel items={h.pillars} />
        </div>
      </section>

      <section className="vision" aria-label="Our vision">
        <div className="vision__pin">
          <img className="vision__bg" src={visionBg} alt="" loading="lazy" />
          <figure className="vision__q" id="visionQ">
            <blockquote>{h.visionQuote}</blockquote>
            <hr className="rule" />
            <figcaption>
              {h.visionName}
              <span>{h.visionRole}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="band chapters" id="chapters">
        <div className="wrap">
          <h3>{h.chaptersTitle}</h3>
          <hr className="rule rule--gold" style={{ marginTop: '1.2em' }} />
          <div className="chapters__grid">
            {h.chapters.map((c) => {
              const m = media(c.image, c.fallback, 1400)
              return (
                <a className="chapter" href={c.href} key={c.eyebrow}>
                  <div className="chapter__frame">
                    <img className="chapter__img" src={m.src} srcSet={m.srcSet} sizes="(max-width:880px) 92vw, 33vw" alt={c.alt} loading="lazy" />
                  </div>
                  <div className="eyebrow">{c.eyebrow}</div>
                  <h4>{c.title}</h4>
                  <p>{c.body}</p>
                  <span className="more">{c.linkLabel}</span>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <section className="band updates" id="updates">
        <div className="wrap">
          <div>
            <div className="eyebrow">{h.insiderEyebrow}</div>
            <h3>{h.insiderTitle}</h3>
            <p className="sub">{h.insiderSubtitle}</p>
            <p>{h.insiderBody}</p>
            <ul className="perks">
              {h.insiderPerks.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <InsiderForm button={h.insiderButton} />
        </div>
      </section>
    </>
  )
}
