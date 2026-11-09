'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Link = { href: string; label: string }

/** Menu button and full-screen menu for tablets and phones (under 1,180px wide). */
export default function MobileMenu({ links, cta }: { links: Link[]; cta: Link }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button type="button" className="burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mmenu" onClick={() => setOpen(!open)}>
        <span />
        <span />
        <span />
      </button>
      {mounted &&
        createPortal(
      <div className={`mmenu${open ? ' is-open' : ''}`} id="mmenu" hidden={!open}>
        <nav aria-label="Main">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn mmenu__cta" href={cta.href} onClick={() => setOpen(false)}>
            {cta.label}
          </a>
        </nav>
      </div>,
          document.body,
        )}
    </>
  )
}
