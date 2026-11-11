import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { InsiderBand } from '@/components/Blocks'
import { Portrait, roleIn } from '@/components/Person'
import { getPerson, getVisiblePeople } from '@/lib/pages'

export const revalidate = 60
type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getVisiblePeople()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPerson((await params).slug)
  const role = p && roleIn(p, p.group)
  return p ? { title: role ? `${p.name}, ${role}` : p.name, description: p.shortBio?.replace(/\s+/g, ' ').trim() } : {}
}

export default async function PersonPage({ params }: Props) {
  const p = await getPerson((await params).slug)
  if (!p) notFound()
  // Blank lines start a new paragraph; a single return is kept as a line break
  const bio = (p.shortBio || '').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
  const quote = p.quote?.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
  return (
    <>
      <section className="band profile">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            {p.group === 'advancement' ? <a href="/giving#advancement">Advancement</a> : <a href="/visionaries">The Visionaries</a>} / {p.name}
          </nav>
          <div className="profile__grid">
            <div className="profile__media">
              <Portrait p={p} size={900} />
            </div>
            <div className="profile__text">
              <h1>{p.name}</h1>
              {roleIn(p, p.group) && <p className="profile__role">{roleIn(p, p.group)}</p>}
              <hr className="rule rule--green" />
              {bio.length ? (
                bio.map((para, i) => (
                  <p className="profile__bio" key={i}>
                    {para.split('\n').map((line, j) => (
                      <span key={j}>
                        {j > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </p>
                ))
              ) : (
                <p className="profile__bio muted">Biography coming soon.</p>
              )}
              {!!quote?.length && (
                <figure className="profile__quote">
                  <blockquote>
                    {quote.map((q, i) => (
                      <p key={i}>{q}</p>
                    ))}
                  </blockquote>
                </figure>
              )}
            </div>
          </div>
        </div>
      </section>
      <InsiderBand />
    </>
  )
}
