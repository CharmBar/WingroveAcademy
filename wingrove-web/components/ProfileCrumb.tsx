'use client'

import { useEffect, useState } from 'react'

/**
 * Breadcrumb that leads back to wherever the visitor opened the profile from:
 *   ?from=leadership → The Visionaries
 *   ?from=team       → Advancement on The Visionaries
 *   ?from=giving     → Advancement on Giving
 * Without it (a shared or typed link), Advancement members lead to Giving and everyone else to The Visionaries.
 */
const BACK = {
  leadership: { href: '/visionaries#leadership', label: 'The Visionaries' },
  team: { href: '/visionaries#advancement', label: 'Advancement' },
  giving: { href: '/giving#advancement', label: 'Advancement' },
} as const

export default function ProfileCrumb({ name, group }: { name: string; group?: string }) {
  const fallback = group === 'advancement' ? BACK.giving : { href: '/visionaries', label: 'The Visionaries' }
  const [back, setBack] = useState<{ href: string; label: string }>(fallback)
  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get('from') as keyof typeof BACK | null
    if (from && BACK[from]) setBack(BACK[from])
  }, [])
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <a href={back.href}>{back.label}</a> / {name}
    </nav>
  )
}
