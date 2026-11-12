'use client'

/**
 * The "Scroll" cue at the foot of the opening. A real link: it glides to the opening's final frame
 * ("World-class private PK–12 education…"), so keyboard and switch users can skip the long zoom
 * without missing its closing line. Without JavaScript, or with reduced motion (where the opening is
 * a single screen), it simply jumps to the Welcome section.
 */
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
    window.scrollTo({ top, behavior: 'smooth' })
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
