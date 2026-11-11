'use client'

import { useEffect, useState } from 'react'

/**
 * A native frond as a quiet accent under the South Florida headline. Preview only for now:
 * it appears when the address has ?preview=frond.
 */
export default function FrondAccent() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    setShow(new URLSearchParams(window.location.search).get('preview') === 'frond')
  }, [])
  if (!show) return null
  return <img className="region__frond" src="/brand/frond.svg" alt="" aria-hidden="true" />
}
