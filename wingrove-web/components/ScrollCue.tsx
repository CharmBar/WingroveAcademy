'use client'

/**
 * The "Scroll" cue at the foot of the opening. A real link: it glides to the opening's final frame
 * ("World-class private PK–12 education…"), so keyboard and switch users can skip the long zoom
 * without missing its closing line. Without JavaScript, or with reduced motion (where the opening is
 * a single screen), it simply jumps to the Welcome section.
 */
/**
 * A slow, eased glide (the browser's own smooth scroll rushes through the zoom in well under a
 * second). Roughly 1.3s per screen of distance, between 4 and 7.5 seconds. Any wheel, touch or key
 * press hands control straight back to the visitor.
 */
function glide(to: number) {
  const from = window.scrollY
  const dist = to - from
  if (Math.abs(dist) < 2) return
  const ms = Math.min(7500, Math.max(4000, (Math.abs(dist) / window.innerHeight) * 1300))
  // Sine ease: gentle start and finish without a rush in the middle
  const ease = (t: number) => (1 - Math.cos(Math.PI * t)) / 2
  const root = document.documentElement
  const prev = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'
  let raf = 0
  const start = performance.now()
  const stop = () => {
    cancelAnimationFrame(raf)
    root.style.scrollBehavior = prev
    for (const ev of ['wheel', 'touchstart', 'keydown', 'mousedown'] as const) window.removeEventListener(ev, stop)
  }
  for (const ev of ['wheel', 'touchstart', 'keydown', 'mousedown'] as const) window.addEventListener(ev, stop, { passive: true })
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms)
    window.scrollTo(0, from + dist * ease(t))
    if (t < 1) raf = requestAnimationFrame(step)
    else stop()
  }
  raf = requestAnimationFrame(step)
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
    // 0.9 of the way through: the closing line is fully shown (see ScrollEffects, --tb)
    const top = stage.getBoundingClientRect().top + window.scrollY + span * 0.9
    glide(top)
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
