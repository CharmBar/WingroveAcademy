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

/**
 * In an Advancement section, people who are also on the ElevateED founding leadership team
 * (they have a Founding Leadership position) carry ", ElevateED" after their title.
 */
export const roleIn = (p: Person, section?: string) =>
  p.role && section === 'advancement' && typeof p.leadershipOrder === 'number' && !/elevateed/i.test(p.role) ? `${p.role}, ElevateED` : p.role

export function PersonCard({ p, section }: { p: Person; section?: 'leadership' | 'advancement' }) {
  const role = roleIn(p, section)
  return (
    <a className="pcard" href={`/visionaries/${p.slug}`}>
      <div className="pcard__media">
        <Portrait p={p} />
      </div>
      <div className="pcard__name">{p.name}</div>
      {role && <div className="pcard__role">{role}</div>}
    </a>
  )
}
