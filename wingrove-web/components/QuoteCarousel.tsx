'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type Quote = { quote: string; attribution: string }

const INTERVAL = 9000

/**
 * Parent quotes over the palm leaf. One quote shows on its own; two or three crossfade every
 * 9 seconds, with dots to choose one and a sideways swipe on touch screens. Pauses on hover, focus,
 * when off screen, and for visitors who turn off motion.
 */
export default function QuoteCarousel({ quotes, image }: { quotes: Quote[]; image: string }) {
  const n = quotes.length
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reduce, setReduce] = useState(false)
  const root = useRef<HTMLElement>(null)
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null)
  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n])

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const running = n > 1 && !paused && visible && !reduce
  useEffect(() => {
    if (!running) return
    const t = window.setTimeout(() => go(i + 1), INTERVAL)
    return () => window.clearTimeout(t)
  }, [running, i, go])

  if (!n) return null

  return (
    <section
      ref={root}
      className="band pquotes"
      aria-roledescription={n > 1 ? 'carousel' : undefined}
      aria-label="What families are saying"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onPointerDown={(e) => {
        if (n > 1 && e.pointerType !== 'mouse') swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
      }}
      onPointerUp={(e) => {
        const s = swipe.current
        swipe.current = null
        if (!s || s.id !== e.pointerId) return
        const dx = e.clientX - s.x
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.5) go(dx < 0 ? i + 1 : i - 1)
      }}
      onPointerCancel={() => (swipe.current = null)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(i + 1)
        if (e.key === 'ArrowLeft') go(i - 1)
      }}
    >
      <img className="pquotes__bg" src={image} alt="" aria-hidden="true" loading="lazy" />
      <div className="wrap pquotes__stage">
        {quotes.map((q, k) => (
          <figure
            key={k}
            className={`pquotes__item${k === i ? ' is-on' : ''}`}
            aria-hidden={k !== i}
            aria-roledescription={n > 1 ? 'slide' : undefined}
            aria-label={n > 1 ? `${k + 1} of ${n}` : undefined}
          >
            <blockquote>“{q.quote.replace(/^[“"]+|[”"]+$/g, '')}”</blockquote>
            {q.attribution && <figcaption>— {q.attribution}</figcaption>}
          </figure>
        ))}
      </div>
      {n > 1 && (
        <div className="pquotes__dots" role="tablist" aria-label="Choose a quote">
          {quotes.map((q, k) => (
            <button key={k} type="button" role="tab" aria-selected={k === i} aria-label={`Quote ${k + 1}`} className={k === i ? 'is-on' : undefined} onClick={() => go(k)} />
          ))}
        </div>
      )}
    </section>
  )
}
