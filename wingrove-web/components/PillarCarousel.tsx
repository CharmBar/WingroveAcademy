'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { PillarCard } from '@/lib/content'

const INTERVAL = 8000
/** Matches the section ids on the Why Wingrove page, where each distinction is told in full. */
const whyId = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * What Makes Wingrove Distinctive: one full-width card at a time (image beside the text). Advances on its own every 8 seconds; pauses on hover, focus, when off screen, and for
 * visitors who turn off motion. On touch screens the cards can be swiped left and right; vertical
 * swipes still scroll the page.
 */
export default function PillarCarousel({ items }: { items: PillarCard[] }) {
  const n = items.length
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reduce, setReduce] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  // Swipe: follows the finger once a gesture is clearly sideways, then snaps to the next or previous card.
  const drag = useRef<{ x: number; y: number; id: number; dx: number; lock?: 'x' | 'y' } | null>(null)
  const swiped = useRef(false)
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)

  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n])

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const running = !paused && visible && !reduce && n > 1
  useEffect(() => {
    if (!running) return
    const t = window.setTimeout(() => go(i + 1), INTERVAL)
    return () => window.clearTimeout(t)
  }, [running, i, go])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' || n < 2) return
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId, dx: 0 }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    const mx = e.clientX - d.x
    const my = e.clientY - d.y
    if (!d.lock && (Math.abs(mx) > 8 || Math.abs(my) > 8)) {
      d.lock = Math.abs(mx) > Math.abs(my) ? 'x' : 'y'
      if (d.lock === 'x') {
        e.currentTarget.setPointerCapture(e.pointerId)
        setDragging(true)
        setPaused(true)
      }
    }
    if (d.lock === 'x') {
      d.dx = mx
      setDx(mx)
    }
  }
  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    drag.current = null
    if (d.lock !== 'x') return
    const limit = Math.min(80, e.currentTarget.clientWidth * 0.15)
    if (d.dx < -limit) go(i + 1)
    else if (d.dx > limit) go(i - 1)
    swiped.current = true
    window.setTimeout(() => (swiped.current = false), 50)
    setDragging(false)
    setDx(0)
    setPaused(false)
  }

  if (!n) return null
  const pad = (k: number) => String(k).padStart(2, '0')

  return (
    <div
      ref={root}
      className={`pc${running ? ' is-running' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="What makes Wingrove distinctive"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(i + 1)
        if (e.key === 'ArrowLeft') go(i - 1)
      }}
    >
      <div
        className={`pc__viewport${dragging ? ' is-dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        <ol className="pc__track" style={{ transform: `translateX(calc(${-i} * (var(--pc-slide) + var(--pc-gap)) + ${dx}px))` }}>
          {items.map((p, k) => (
            <li
              key={`${p.label}-${k}`}
              className={`pc__slide${k === i ? ' is-on' : ''}`}
              aria-roledescription="slide"
              aria-label={`${k + 1} of ${n}`}
              aria-hidden={k !== i}
              onClick={() => !swiped.current && k !== i && go(k)}
            >
              <div className="pc__media">
                <img src={p.src} srcSet={p.srcSet} sizes="(max-width:880px) 92vw, 48vw" alt={p.alt} loading={k < 2 ? 'eager' : 'lazy'} draggable={false} />
              </div>
              <div className="pc__text">
                <div className="pc__count">
                  {pad(k + 1)} <span>/ {pad(n)}</span>
                </div>
                <h4>{p.label}</h4>
                <a className="pc__more" href={`/why-wingrove#${whyId(p.label)}`} aria-label={`More about ${p.label}`} tabIndex={k === i ? 0 : -1} onClick={(e) => e.stopPropagation()}>
                  <span className="pc__bar" />
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="pc__controls">
        <div className="pc__steps" role="tablist" aria-label="Choose a card">
          {items.map((p, k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`${k + 1}. ${p.label}`}
              className={`pc__step${k === i ? ' is-on' : ''}${k < i ? ' is-past' : ''}`}
              onClick={() => go(k)}
            >
              <span style={k === i ? { animationDuration: `${INTERVAL}ms` } : undefined} />
            </button>
          ))}
        </div>
        <div className="pc__arrows">
          <button type="button" className="pc__arrow" aria-label="Previous" onClick={() => go(i - 1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button type="button" className="pc__arrow" aria-label="Next" onClick={() => go(i + 1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <p className="sr" aria-live="polite">
        {running ? '' : `${items[i].label}, ${i + 1} of ${n}`}
      </p>
    </div>
  )
}
