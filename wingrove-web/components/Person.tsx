import type { Person } from '@/lib/pages'

export const initials = (name: string) =>
  name
    .replace(/^Dr\.\s+/, '')
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

export function Portrait({ p, size = 600 }: { p: Person; size?: number }) {
  return p.photo ? (
    <img src={`${p.photo}?w=${size}&auto=format&q=80`} alt={`Portrait of ${p.name}`} loading="lazy" />
  ) : (
    <div className="mono" aria-hidden="true">
      <img src="/brand/crest-white.png" alt="" />
      <span>{initials(p.name)}</span>
    </div>
  )
}

export function PersonCard({ p }: { p: Person }) {
  return (
    <a className="pcard" href={`/visionaries/${p.slug}`}>
      <div className="pcard__media">
        <Portrait p={p} />
      </div>
      <div className="pcard__name">{p.name}</div>
      {p.role && <div className="pcard__role">{p.role}</div>}
    </a>
  )
}
