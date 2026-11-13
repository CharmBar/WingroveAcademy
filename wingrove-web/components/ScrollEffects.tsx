'use client'

import { useEffect } from 'react'

/** Drives the opening sequence (crest rises, zoom into the campus) and the vision quote layer from scroll position. */
export default function ScrollEffects() {
  useEffect(() => {
    const stage = document.getElementById('stage')
    const hdr = document.getElementById('hdr')
    const lockup = document.getElementById('lockup')
    const vision = document.querySelector<HTMLElement>('.vision')
    if (!hdr) return
    if (!stage || !lockup) {
      // Pages without the opening: plain solid header
      hdr.classList.remove('is-locked')
      hdr.style.setProperty('--hdr-ui', '1')
      hdr.style.setProperty('--hdr-logo', '1')
      hdr.style.setProperty('--hdr-bg', '.96')
      return
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
    const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1)
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
    const set = (el: HTMLElement, k: string, v: string | number) => el.style.setProperty(k, String(v))

    function frame() {
      const r = stage!.getBoundingClientRect()
      const span = stage!.offsetHeight - window.innerHeight
      const p = span > 0 ? clamp(-r.top / span, 0, 1) : 1
      // 1. crest and wordmark grow at the same rate as the campus behind them (same zoom curve),
      //    drifting up only slightly, and fade out as they grow rather than sliding off screen
      const z = ease(seg(p, 0.02, 0.5))
      //    The campus curve starts very slowly, so the lockup gets its own, quicker start: it is
      //    nearer the viewer, keeps growing the whole time it is fading, and never looks parked.
      const lz = Math.pow(seg(p, 0.02, 0.3), 1.35)
      set(lockup!, '--ly', (-window.innerHeight * 0.06 * lz).toFixed(1) + 'px')
      set(lockup!, '--ls', (1 + 2.6 * z + 2.2 * lz).toFixed(4))
      set(lockup!, '--lo', (1 - seg(p, 0.06, 0.28)).toFixed(3))
      set(lockup!, '--lb', (6 * seg(p, 0.12, 0.28)).toFixed(2) + 'px')
      set(hdr!, '--hdr-logo', seg(p, 0.18, 0.28).toFixed(3))
      set(hdr!, '--hdr-ui', seg(p, 0.14, 0.26).toFixed(3))
      hdr!.classList.toggle('is-locked', p < 0.16)
      set(stage!, '--cue', (1 - seg(p, 0, 0.05)).toFixed(3))
      // 2. drawing closer to the entrance (z, above)
      set(stage!, '--zoom', (1 + 2.6 * z).toFixed(4))
      set(stage!, '--lift', (-window.innerHeight * 0.05 * z).toFixed(1) + 'px')
      set(stage!, '--shade', (1 - 0.6 * seg(p, 0, 0.25) + 1.1 * Math.min(seg(p, 0.24, 0.31), 1 - seg(p, 0.44, 0.5))).toFixed(3))
      // through the entrance into the courtyard, then inside to the commons
      set(stage!, '--sa', ease(seg(p, 0.4, 0.5)).toFixed(3))
      set(stage!, '--za', seg(p, 0.4, 0.7).toFixed(3))
      set(stage!, '--sb', ease(seg(p, 0.62, 0.72)).toFixed(3))
      set(stage!, '--zb', seg(p, 0.62, 0.92).toFixed(3))
      set(stage!, '--ta', Math.min(seg(p, 0.26, 0.33), 1 - seg(p, 0.42, 0.48)).toFixed(3))
      // 3. release into the welcome band
      set(stage!, '--veil', (0.9 * ease(seg(p, 0.78, 0.94))).toFixed(3))
      set(stage!, '--tb', Math.min(seg(p, 0.8, 0.88), 1 - seg(p, 0.95, 1)).toFixed(3))
      // header turns solid once the stage is behind us
      set(hdr!, '--hdr-bg', r.bottom <= hdr!.offsetHeight + 2 ? 0.96 : 0)
    }
    function visionFrame() {
      if (!vision) return
      const r = vision.getBoundingClientRect()
      const h = window.innerHeight
      const t = clamp((h - r.top) / (h * 2), 0, 1)
      set(vision, '--vy', ((t - 0.5) * -60).toFixed(1) + 'px')
      set(vision, '--vq', ((1 - seg(t, 0.15, 0.45)) * 40).toFixed(1) + 'px')
      set(vision, '--vo', (0.25 + 0.75 * seg(t, 0.12, 0.4)).toFixed(3))
    }
    if (reduce) {
      hdr.classList.remove('is-locked')
      return
    }
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        frame()
        visionFrame()
      })
    }
    frame()
    visionFrame()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return null
}
