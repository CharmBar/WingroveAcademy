'use client'

/**
 * The "Scroll" cue at the foot of the opening. A real link: it glides to the opening's final frame
 * ("World-class private PK–12 education…"), so keyboard and switch users can skip the long zoom
 * without missing its closing line. Without JavaScript, or with reduced motion (where the opening is
 * a single screen), it simply jumps to the Welcome section.
 *

 * A slow, eased glide through a list of stops (the browser's own smooth scroll rushes through the
 * zoom in well under a second). Each leg takes roughly 1.7s per screen, at least 3.2s, with a sine
 * ease so it settles into each stop, and holds there for `hold` ms before moving on. Any wheel,
 * touch or key press hands control straight back to the visitor.
 */
function glide(stops: { top: number; hold?: number }[]) {
  const ease = (t: number) => (1 - Math.cos(Math.PI * t)) / 2
  const root = document.documentElement
  const prev = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'
  let raf = 0
  let timer = 0
  const evs = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const
  const stop = () => {
    cancelAnimationFrame(raf)
    clearTimeout(timer)
    root.style.scrollBehavior = prev
    for (const ev of evs) window.removeEventListener(ev, stop)
  }
  for (const ev of evs) window.addEventListener(ev, stop, { passive: true })
  const leg = (i: number) => {
    if (i >= stops.length) return stop()
    const from = window.scrollY
    const dist = stops[i].top - from
    const ms = Math.min(5000, Math.max(3200, (Math.abs(dist) / window.innerHeight) * 1700))
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      window.scrollTo(0, from + dist * ease(t))
      if (t < 1) raf = requestAnimationFrame(step)
      else timer = window.setTimeout(() => leg(i + 1), stops[i].hold || 0)
    }
    raf = requestAnimationFrame(step)
  }
  leg(0)
}

export default function ScrollCue({ label = 'Scroll' }: { label?: string }) {
  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const stage = document.getElementById('stage')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const span = stage ? stage.offsetHeight - window.innerHeight : 0
    if (!stage || reduce || span <= 0) {
      // Plain jump to #welcome; move focus there so the next Tab continues from the content.
      window.setTimeout(() => document.getElementById('welcome')?.focus({ preventScroll: true }), 0)
      return
    }
    e.preventDefault()
    // Stops match ScrollEffects: the tagline is fully shown from 0.33 to 0.42 of the way through
    // (--ta), the closing line from 0.88 to 0.95 (--tb). Pause on the tagline, end on the closing line.
    const base = stage.getBoundingClientRect().top + window.scrollY
    const at = (f: number) => base + span * f
    const stops = window.scrollY < at(0.33) ? [{ top: at(0.375), hold: 1800 }, { top: at(0.9) }] : [{ top: at(0.9) }]
    glide(stops)
    document.getElementById('welcome')?.focus({ preventScroll: true })
  }

  return (
    <a className="cue" href="#welcome" onClick={onClick} aria-label="Skip the opening animation">
      <span className="cue__in intro-fade intro-fade--late">
        {label}
        <svg className="cue__arrow" viewBox="0 0 12 18" aria-hidden="true">
          <path d="M6 1v15M1.5 11.5L6 16l4.5-4.5" />
        </svg>
      </span>
    </a>
  )
}
