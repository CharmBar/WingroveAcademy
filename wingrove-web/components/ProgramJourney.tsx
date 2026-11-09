'use client'

import { useEffect, useRef, useState } from 'react'
import type { Division, ProgramView } from '@/lib/pages'

/**
 * Signature Programs: choose a program and its PK–12 journey replays across the three schools,
 * lining up with the school cards above. The green line draws left to right and each stage fades in
 * after the last; the image crossfades. On phones the stages stack down a vertical line and a
 * sideways swipe moves between programs. Hidden unless switched on in the Studio, or the address
 * has ?preview=programs.
 */
export default function ProgramJourney({
  enabled,
  eyebrow,
  title,
  body,
  programs,
  divisions,
}: {
  enabled: boolean
  eyebrow: string
  title: string
  body: string
  programs: ProgramView[]
  divisions: Division[]
}) {
  const [show, setShow] = useState(enabled)
  const [i, setI] = useState(0)
  const [run, setRun] = useState(0)
  const root = useRef<HTMLElement>(null)
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null)
  const n = programs.length

  useEffect(() => {
    if (!enabled && new URLSearchParams(window.location.search).get('preview') === 'programs') setShow(true)
  }, [enabled])

  // Play the journey the first time the section scrolls into view
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = root.current
    if (!el || seen) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [show, seen])

  // Keep the chosen program's chip in view in the sideways-scrolling chip row on phones
  const tabs = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const row = tabs.current
    const on = row?.children[i] as HTMLElement | undefined
    if (!row || !on || row.scrollWidth <= row.clientWidth) return
    row.scrollTo({ left: on.offsetLeft - row.offsetLeft - 16, behavior: 'smooth' })
  }, [i])

  if (!show || !n) return null
  const choose = (k: number) => {
    const next = ((k % n) + n) % n
    if (next === i) return
    setI(next)
    setRun((r) => r + 1)
  }
  const p = programs[i]

  return (
    <section className="band programs" id="programs" ref={root}>
      <div className="wrap">
        <div className="programs__head">
          <div>
            <div className="eyebrow">{eyebrow}</div>
            <h2 className="h2">{title}</h2>
            <hr className="rule rule--green" />
          </div>
          <p>{body}</p>
        </div>

        <div className="programs__tabs" ref={tabs} role="tablist" aria-label="Choose a signature program">
          {programs.map((x, k) => (
            <button
              key={x.name}
              type="button"
              role="tab"
              id={`prog-tab-${k}`}
              aria-selected={k === i}
              aria-controls="prog-panel"
              className={`programs__tab${k === i ? ' is-on' : ''}`}
              onClick={() => choose(k)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') choose(i + 1)
                if (e.key === 'ArrowLeft') choose(i - 1)
              }}
            >
              {x.name}
            </button>
          ))}
        </div>

        <div
          className="programs__panel"
          id="prog-panel"
          role="tabpanel"
          aria-labelledby={`prog-tab-${i}`}
          onPointerDown={(e) => {
            if (e.pointerType !== 'mouse') swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
          }}
          onPointerUp={(e) => {
            const s = swipe.current
            swipe.current = null
            if (!s || s.id !== e.pointerId) return
            const dx = e.clientX - s.x
            const dy = e.clientY - s.y
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) choose(dx < 0 ? i + 1 : i - 1)
          }}
          onPointerCancel={() => (swipe.current = null)}
        >
          <div className="programs__media">
            {programs.map((x, k) => (
              <img
                key={x.name}
                className={k === i ? 'is-on' : undefined}
                src={x.image.src}
                srcSet={x.image.srcSet}
                sizes="(max-width:880px) 92vw, 1180px"
                alt={k === i ? x.image.alt : ''}
                aria-hidden={k !== i}
                loading="lazy"
                draggable={false}
              />
            ))}
          </div>

          <ol className={`programs__journey${seen ? ' is-playing' : ''}`} key={`${i}-${run}`} aria-label={`${p.name}, from Lower to Upper School`}>
            {p.stages.map((s, k) => {
              const d = divisions[k]
              return (
                <li key={k} style={{ ['--k' as string]: k }}>
                  <div className="programs__school">
                    {d?.name}
                    {d?.grades && <span> · {d.grades}</span>}
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
