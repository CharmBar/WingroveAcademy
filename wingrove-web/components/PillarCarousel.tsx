'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { PillarCard } from '@/lib/content'

const INTERVAL = 8000

/**
 * What Makes Wingrove Distinctive: one large card at a time (image beside the text), the next card
 * peeking in. Advances on its own every 8 seconds; pauses on hover, focus, when off screen, and for
 * visitors who turn off motion.
 */
export default function PillarCarousel({ items }: { items: PillarCard[] }) {
  const n = items.length
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reduce, setReduce] = useState(false)
  const root = useRef<HTMLDivElement>(null)

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
      <div className="pc__viewport">
        <ol className="pc__track" style={{ transform: `translateX(calc(${-i} * (var(--pc-slide) + var(--pc-gap))))` }}>
          {items.map((p, k) => (
            <li
              key={`${p.label}-${k}`}
              className={`pc__slide${k === i ? ' is-on' : ''}`}
              aria-roledescription="slide"
              aria-label={`${k + 1} of ${n}`}
              aria-hidden={k !== i}
              onClick={() => k !== i && go(k)}
            >
              <div className="pc__media">
                <img src={p.src} srcSet={p.srcSet} sizes="(max-width:880px) 92vw, 48vw" alt={p.alt} loading={k < 2 ? 'eager' : 'lazy'} />
              </div>
              <div className="pc__text">
                <div className="pc__count">
                  {pad(k + 1)} <span>/ {pad(n)}</span>
                </div>
                <h4>{p.label}</h4>
                <hr className="rule rule--green" />
                <p>{p.body}</p>
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
