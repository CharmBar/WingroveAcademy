'use client'

import { useEffect, useRef, useState } from 'react'

const DURATION = 2000

/**
 * Counts a figure such as "$50.6 Million" up from zero the first time it scrolls into view,
 * fast at first and easing into the total. Whatever is entered in the Studio is the total, so a
 * new figure just works. The page is rendered with the final figure (for search engines and
 * visitors who turn off motion), and the space it takes is reserved so nothing shifts while counting.
 */
export default function CountUp({ value }: { value: string }) {
  const m = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(value.trim())
  const prefix = m?.[1] ?? ''
  const raw = m?.[2] ?? ''
  const suffix = m?.[3] ?? ''
  const target = parseFloat(raw.replace(/,/g, ''))
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
  const commas = raw.includes(',')
  const ok = !!m && Number.isFinite(target)

  const [shown, setShown] = useState<number | null>(null)
  const el = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ok || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const node = el.current
    if (!node) return
    let raf = 0
    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION)
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t) // quick start, gentle finish
        setShown(target * eased)
        if (t < 1) raf = requestAnimationFrame(tick)
        else setShown(null)
      }
      raf = requestAnimationFrame(tick)
    }
    setShown(0)
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        run()
      },
      { threshold: 0.6 },
    )
    io.observe(node)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [ok, target])

  if (!ok) return <>{value}</>
  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: commas })

  return (
    <span className="countup" ref={el}>
      <span className="countup__final" aria-hidden={shown !== null}>
        {value}
      </span>
      {shown !== null && (
        <span className="countup__live" aria-hidden="true">
          {prefix}
          {fmt(shown)}
          {suffix}
        </span>
      )}
    </span>
  )
}
