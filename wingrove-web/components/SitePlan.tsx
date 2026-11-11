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
  shift = 0,
}: {
  src: string
  srcSet?: string
  areas: PlanMark[]
  street?: { label: string; x: number; y: number }
  /** Moves the map and everything on it left by this % of its width, so the campus edge meets the text edge. */
  shift?: number
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
      <div className="plan__map" style={shift ? { transform: `translateX(-${shift}%)` } : undefined}>
        <img src={src} srcSet={srcSet} sizes="(max-width:880px) 100vw, 66vw" alt="Illustrated aerial plan of the Wingrove Academy campus" loading="lazy" />
        {street?.label && <StreetArrow {...street} />}
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

/**
 * Street name in the paper margin with a hand-drawn style arrow that sweeps out from the end of the
 * name and hooks down onto the road. (x, y) is the arrow tip, in % of the plan; the name sits above-left.
 * Drawn in plan percentages so it scales with the map; the stroke stays the same width at any size.
 */
function StreetArrow({ label, x, y }: { label: string; x: number; y: number }) {
  const sx = x - 4.2 // where the curve starts, just after the name
  const sy = Math.max(y - 10, 3.5) // the name stays in the margin above the treeline, clear of the top edge
  const c1 = [sx + 5.4, sy - 0.8]
  const c2 = [x + 3.8, y - 5.2]
  // arrowhead follows the curve's final direction
  const ang = Math.atan2(y - c2[1], x - c2[0])
  const head = (da: number) => [x - 1.6 * Math.cos(ang + da), y - 1.9 * Math.sin(ang + da)]
  const [h1, h2] = [head(0.5), head(-0.5)]
  return (
    <>
      <span className="plan__street-name" style={{ right: `${100 - sx + 0.8}%`, top: `${sy}%` }} aria-hidden="true">
        {label}
      </span>
      <svg className="plan__street-arrow" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d={`M ${sx} ${sy} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${x} ${y}`} />
        <path d={`M ${h1[0]} ${h1[1]} L ${x} ${y} L ${h2[0]} ${h2[1]}`} />
      </svg>
    </>
  )
}
