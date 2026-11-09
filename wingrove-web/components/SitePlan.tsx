'use client'

import { useState } from 'react'
import type { Area } from '@/lib/pages'

/** Illustrated site plan with numbered markers; selecting a marker or a list item highlights both. */
export default function SitePlan({ src, srcSet, areas }: { src: string; srcSet?: string; areas: Area[] }) {
  const [active, setActive] = useState<number | null>(null)
  const current = areas.find((a) => a.n === active)
  return (
    <div className="plan">
      <div className="plan__map">
        <img src={src} srcSet={srcSet} sizes="(max-width:880px) 100vw, 66vw" alt="Illustrated aerial plan of the Wingrove Academy campus" loading="lazy" />
        {areas.map((a) => (
          <button
            key={a.n}
            type="button"
            className={`plan__pin${active === a.n ? ' is-on' : ''}`}
            style={{ left: `${a.x}%`, top: `${a.y}%` }}
            aria-label={`${a.n}. ${a.label}`}
            aria-pressed={active === a.n}
            onClick={() => setActive(active === a.n ? null : a.n)}
            onMouseEnter={() => setActive(a.n)}
          >
            {a.n}
          </button>
        ))}
        {current && (
          <div className="plan__tip" style={{ left: `${current.x}%`, top: `${current.y}%` }} role="status">
            <strong>{current.label}</strong>
            {current.note && <span>{current.note}</span>}
          </div>
        )}
      </div>
      <ol className="plan__list">
        {areas.map((a) => (
          <li key={a.n}>
            <button type="button" className={active === a.n ? 'is-on' : ''} onClick={() => setActive(active === a.n ? null : a.n)} onMouseEnter={() => setActive(a.n)}>
              <span className="plan__num">{a.n}</span>
              {a.label}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
