'use client'

import { useState } from 'react'
import type { PlanMark } from '@/lib/pages'

const group = (a: PlanMark) => `${a.kind}:${a.mark}:${a.label}`

/**
 * Illustrated site plan with lettered (navy) and numbered (light blue) markers. Selecting a marker or
 * a list item highlights both; markers that share a label and mark (the two Gate Houses) light up together.
 * The list shows letters first, then numbers, each place once.
 */
export default function SitePlan({
  src,
  srcSet,
  areas,
  street,
}: {
  src: string
  srcSet?: string
  areas: PlanMark[]
  street?: { label: string; x: number; y: number }
}) {
  const [active, setActive] = useState<number | null>(null)
  const current = areas.find((a) => a.i === active) || null
  const on = (a: PlanMark) => !!current && group(a) === group(current)
  const toggle = (i: number) => setActive(active === i ? null : i)

  const seen = new Set<string>()
  const list = [...areas.filter((a) => a.kind === 'letter'), ...areas.filter((a) => a.kind === 'number').sort((a, b) => Number(a.n) - Number(b.n))].filter((a) => {
    const g = group(a)
    if (seen.has(g)) return false
    seen.add(g)
    return true
  })

  return (
    <div className="plan">
      <div className="plan__map">
        <img src={src} srcSet={srcSet} sizes="(max-width:880px) 100vw, 66vw" alt="Illustrated aerial plan of the Wingrove Academy campus" loading="lazy" />
        {street?.label && (
          <div className="plan__street" style={{ left: `${street.x}%`, height: `${street.y}%` }} aria-hidden="true">
            <span>{street.label}</span>
            <i />
          </div>
        )}
        {areas.map((a) => (
          <button
            key={a.i}
            type="button"
            className={`plan__pin plan__pin--${a.kind}${on(a) ? ' is-on' : ''}`}
            style={{ left: `${a.x}%`, top: `${a.y}%` }}
            aria-label={`${a.mark}. ${a.label}`}
            aria-pressed={on(a)}
            onClick={() => toggle(a.i)}
            onMouseEnter={() => setActive(a.i)}
          >
            {a.mark}
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
        {list.map((a) => (
          <li key={group(a)} className={a.kind === 'number' && list.find((x) => x.kind === 'number') === a ? 'plan__list-break' : undefined}>
            <button type="button" className={on(a) ? 'is-on' : ''} onClick={() => toggle(a.i)} onMouseEnter={() => setActive(a.i)}>
              <span className={`plan__num plan__num--${a.kind}`}>{a.mark}</span>
              {a.label}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
