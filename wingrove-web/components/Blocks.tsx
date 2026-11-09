import type { Pic } from '@/lib/pages'

/** Full-bleed image hero with the page title set over it. */
export function PageHero({ image, eyebrow, title, lead }: { image: Pic; eyebrow: string; title: string; lead?: string }) {
  return (
    <section className="phero">
      <img className="phero__img" src={image.src} srcSet={image.srcSet} sizes="100vw" alt={image.alt} fetchPriority="high" />
      <div className="phero__shade" />
      <div className="band phero__band">
        <div className="wrap">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <hr className="rule" />
          {lead && <p className="phero__lead">{lead}</p>}
        </div>
      </div>
    </section>
  )
}

export function Gallery({ title, items }: { title: string; items: Pic[] }) {
  return (
    <section className="band gallery">
      <div className="wrap">
        <h2 className="h2">{title}</h2>
        <hr className="rule rule--gold" />
        <div className="gallery__grid">
          {items.map((g, i) => (
            <figure className={`gallery__item${i === 0 ? ' gallery__item--wide' : ''}`} key={`${g.src}-${i}`}>
              <div className="gallery__frame">
                <img src={g.src} srcSet={g.srcSet} sizes={i === 0 ? '(max-width:880px) 92vw, 66vw' : '(max-width:880px) 92vw, 33vw'} alt={g.alt} loading="lazy" />
              </div>
              {g.caption && <figcaption>{g.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Closing call to support Wingrove, with the enlarged Wingrove mark behind it. */
export function GivingBand({ eyebrow, title, body, button, href }: { eyebrow: string; title: string; body: string[]; button: string; href: string }) {
  return (
    <section className="band giving">
      <img className="giving__mark" src="/brand/crest-white.png" alt="" aria-hidden="true" />
      <div className="wrap giving__grid">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h2 className="giving__title">{title}</h2>
        </div>
        <div>
          <hr className="rule rule--gold" />
          {body.map((p, i) => (
            <p key={i} className={i === 0 ? 'giving__lead' : undefined}>
              {p}
            </p>
          ))}
          <a className="btn" href={href}>
            {button}
          </a>
        </div>
      </div>
    </section>
  )
}

export function InsiderBand() {
  return (
    <section className="band insider-band">
      <div className="wrap">
        <div>
          <div className="eyebrow">Become an Insider</div>
          <p className="insider-band__title">Follow the vision taking shape for generations to come.</p>
        </div>
        <a className="btn" href="/#updates">
          Follow Our Journey
        </a>
      </div>
    </section>
  )
}
