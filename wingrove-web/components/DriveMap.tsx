'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { basemap } from '@/lib/driveBasemap'
import { ROADS, makeRouter } from '@/lib/driveRoads'

export type DrivePlace = {
  name: string
  area?: string
  /** Typical weekday-morning minutes to campus */
  minutes: number
  /** e.g. "12–20 at drop-off" */
  range?: string
  lat: number
  lng: number
}

type Props = {
  show: boolean
  eyebrow: string
  title: string
  intro: string
  note: string
  campus: { label: string; lat: number; lng: number }
  /** Well-known places (not schools), listed first in their own colour */
  landmarks: DrivePlace[]
  landmarksTitle: string
  /** Schools families already know */
  places: DrivePlace[]
  placesTitle: string
}

type Kind = 'landmark' | 'school'

const { width: W, height: H, bounds: B } = basemap
const COS = Math.cos((((B.north + B.south) / 2) * Math.PI) / 180)
const K = H / (B.north - B.south)
const project = (lat: number, lng: number) => ({ x: (lng - B.west) * COS * K, y: (B.north - lat) * K })

/** Orientation only: a few towns most families know. */
const TOWNS = [
  { name: 'Palm Beach Gardens', lat: 26.823, lng: -80.138 },
  { name: 'Royal Palm Beach', lat: 26.708, lng: -80.23 },
  { name: 'Lake Worth Beach', lat: 26.617, lng: -80.072 },
  { name: 'Boynton Beach', lat: 26.525, lng: -80.066 },
  { name: 'Jupiter', lat: 26.905, lng: -80.11 },
]

type Box = { x: number; y: number; w: number; h: number }
const hit = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h

/**
 * "Closer than you think": drive times to the campus from places families already know.
 * Routes follow a simplified sketch of the main roads (see lib/driveRoads): believable, not exact.
 * The minutes come from the Studio.
 * Hidden until switched on in the Studio, or previewed with ?preview=drive.
 */
export default function DriveMap({ show, eyebrow, title, intro, note, campus, landmarks, landmarksTitle, places, placesTitle }: Props) {
  const [visible, setVisible] = useState(show)
  const [on, setOn] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [count, setCount] = useState(0)
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!show && new URLSearchParams(window.location.search).get('preview') === 'drive') setVisible(true)
  }, [show])

  // Draw the arcs and count the minutes up once the map is in view
  useEffect(() => {
    if (!visible || !mapRef.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setOn(true)
      setCount(1)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        setOn(true)
        const start = performance.now()
        const dur = 2200
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur)
          setCount(1 - Math.pow(1 - t, 3))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.3 },
    )
    io.observe(mapRef.current)
    return () => io.disconnect()
  }, [visible])

  const items = useMemo(() => {
    const by = (a: DrivePlace, b: DrivePlace) => a.minutes - b.minutes
    return [
      ...[...landmarks].sort(by).map((p, i) => ({ p, kind: 'landmark' as Kind, tag: String.fromCharCode(65 + i), id: `l${i}` })),
      ...[...places].sort(by).map((p, i) => ({ p, kind: 'school' as Kind, tag: String(i + 1), id: `s${i}` })),
    ]
  }, [landmarks, places])
  const c = project(campus.lat, campus.lng)

  const { list: marks, towns } = useMemo(() => {
    const router = makeRouter(project)
    const taken: Box[] = [{ x: c.x - 22, y: c.y - 22, w: 44, h: 44 }]
    const pins = items.map(({ p }) => project(p.lat, p.lng))
    pins.forEach((q) => taken.push({ x: q.x - 15, y: q.y - 15, w: 30, h: 30 }))
    // The campus label sits under the campus dot
    taken.push({ x: c.x - 100, y: c.y + 18, w: 200, h: 26 })
    const out = items.map((it, i) => {
      const q = pins[i]
      const pts = router.route(q, c)
      const d = pts.map((pt, k) => `${k ? 'L' : 'M'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ')
      // Time label beside the pin, wherever it does not collide
      const w = 74
      const h = 30
      const opts: Box[] = [
        { x: q.x + 18, y: q.y - h / 2, w, h },
        { x: q.x - 18 - w, y: q.y - h / 2, w, h },
        { x: q.x - w / 2, y: q.y - 18 - h, w, h },
        { x: q.x - w / 2, y: q.y + 18, w, h },
      ]
      const box = opts.find((b) => b.x > 4 && b.x + b.w < W - 4 && !taken.some((t) => hit(b, t))) || opts[0]
      taken.push(box)
      return { ...it, q, d, box }
    })
    const towns = TOWNS.map((t) => {
      const q = project(t.lat, t.lng)
      const w = t.name.length * 9.6
      const anchor = q.x > W * 0.62 ? 'end' : 'middle'
      const box = { x: anchor === 'end' ? q.x - w : q.x - w / 2, y: q.y - 13, w, h: 17 }
      return { ...t, q, anchor, clear: !taken.some((b) => hit(b, box)) }
    }).filter((t) => t.clear)
    return { list: out, towns }
  }, [items, c.x, c.y])

  const roadPaths = useMemo(
    () =>
      ROADS.map((r) => ({
        ...r,
        d: r.pts.map((p, k) => { const q = project(p[0], p[1]); return `${k ? 'L' : 'M'}${q.x.toFixed(1)},${q.y.toFixed(1)}` }).join(' '),
        lab: r.label ? { ...project(r.label.at[0], r.label.at[1]), text: r.label.text } : null,
      })),
    [],
  )

  const row = (m: (typeof marks)[number]) => (
    <li key={m.id}>
      <button
        type="button"
        className={active === m.id ? 'is-active' : undefined}
        onMouseEnter={() => setActive(m.id)}
        onMouseLeave={() => setActive(null)}
        onFocus={() => setActive(m.id)}
        onBlur={() => setActive(null)}
        aria-label={`${m.p.name}${m.p.area ? `, ${m.p.area}` : ''}: about ${m.p.minutes} minutes${m.p.range ? `, ${m.p.range}` : ''}`}
      >
        <span className={`drive__n drive__n--${m.kind}`} aria-hidden="true">
          {m.tag}
        </span>
        <span className="drive__place">
          <strong>{m.p.name}</strong>
          {m.p.area && <span>{m.p.area}</span>}
        </span>
        <span className="drive__time" aria-hidden="true">
          <strong>
            {Math.round(m.p.minutes * count)}
            <small> min</small>
          </strong>
          {m.p.range && <span>{m.p.range}</span>}
        </span>
      </button>
    </li>
  )
  const lms = marks.filter((m) => m.kind === 'landmark')
  const sch = marks.filter((m) => m.kind === 'school')

  if (!visible) return null

  return (
    <section className="band drive" id="drive" aria-labelledby="drive-title">
      <div className="wrap drive__grid">
        <div className="drive__text">
          <p className="eyebrow drive__eyebrow">{eyebrow}</p>
          <h2 className="h2" id="drive-title">
            {title}
          </h2>
          <hr className="rule rule--lime" />
          <p className="drive__intro">{intro}</p>
          {lms.length > 0 && (
            <>
              <h3 className="drive__group drive__group--landmark">{landmarksTitle}</h3>
              <ol className="drive__list">{lms.map(row)}</ol>
            </>
          )}
          {sch.length > 0 && (
            <>
              <h3 className="drive__group drive__group--school">{placesTitle}</h3>
              <ol className="drive__list">{sch.map(row)}</ol>
            </>
          )}
          {note && <p className="drive__note">{note}</p>}
        </div>

        <div className={`drive__map${on ? ' is-on' : ''}${active !== null ? ' has-active' : ''}`} ref={mapRef}>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Map of central Palm Beach County showing ${campus.label} in Wellington and drive times from ${marks.map((m) => m.p.name).join(', ')}.`}>
            <defs>
              <radialGradient id="drive-glow">
                <stop offset="0" stopColor="#BED62F" stopOpacity=".55" />
                <stop offset="1" stopColor="#BED62F" stopOpacity="0" />
              </radialGradient>
              <clipPath id="drive-clip">
                <rect width={W} height={H} rx="2" />
              </clipPath>
            </defs>
            <g clipPath="url(#drive-clip)">
              <rect width={W} height={H} className="drive__sea" />
              {basemap.land.map((d, i) => (
                <path key={i} d={d} className="drive__land" />
              ))}
              {roadPaths.map((r) => (
                <path key={r.name} d={r.d} className={`drive__road drive__road--${r.kind}`} />
              ))}
              {roadPaths.map((r) => r.lab && (
                <text key={`${r.name}-l`} x={r.lab.x} y={r.lab.y} className="drive__roadlabel" textAnchor="middle">
                  <tspan>{r.lab.text}</tspan>
                </text>
              ))}
              {towns.map((t) => (
                <text key={t.name} x={t.q.x} y={t.q.y} className="drive__town" textAnchor={t.anchor as 'end' | 'middle'}>
                  {t.name}
                </text>
              ))}
              {marks.map((m, i) => (
                <path key={m.id} d={m.d} pathLength={1} className={`drive__arc drive__arc--${m.kind}${active === m.id ? ' is-active' : ''}`} style={{ transitionDelay: `${0.15 + i * 0.1}s` }} />
              ))}
              <circle cx={c.x} cy={c.y} r="70" fill="url(#drive-glow)" />
              <circle cx={c.x} cy={c.y} r="13" className="drive__campus" />
              <circle cx={c.x} cy={c.y} r="13" className="drive__pulse" />
              <text x={c.x} y={c.y + 36} className="drive__campus-label" textAnchor="middle">
                {campus.label}
              </text>
              {marks.map(({ p, q, box, id, kind, tag }, i) => (
                <g key={id} className={`drive__pin drive__pin--${kind}${active === id ? ' is-active' : ''}`} onMouseEnter={() => setActive(id)} onMouseLeave={() => setActive(null)}>
                  <circle cx={q.x} cy={q.y} r="13" />
                  <text x={q.x} y={q.y + 5} textAnchor="middle">
                    {tag}
                  </text>
                  <g className="drive__chip" style={{ transitionDelay: `${0.9 + i * 0.1}s` }}>
                    <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={box.h / 2} />
                    <text x={box.x + box.w / 2} y={box.y + box.h / 2 + 6} textAnchor="middle">
                      {Math.round(p.minutes * count)} min
                    </text>
                  </g>
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}
