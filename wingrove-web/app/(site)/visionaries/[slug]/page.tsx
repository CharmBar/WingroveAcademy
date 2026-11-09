import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { InsiderBand } from '@/components/Blocks'
import { Portrait } from '@/components/Person'
import { getPerson, getVisiblePeople } from '@/lib/pages'

export const revalidate = 60
type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getVisiblePeople()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPerson((await params).slug)
  return p ? { title: p.role ? `${p.name}, ${p.role}` : p.name, description: p.shortBio } : {}
}

export default async function PersonPage({ params }: Props) {
  const p = await getPerson((await params).slug)
  if (!p) notFound()
  const quote = p.quote?.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
  return (
    <>
      <section className="band profile">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href="/visionaries">The Visionaries</a> / {p.name}
          </nav>
          <div className="profile__grid">
            <div className="profile__media">
              <Portrait p={p} size={900} />
            </div>
            <div className="profile__text">
              <h1>{p.name}</h1>
              {p.role && <p className="profile__role">{p.role}</p>}
              <hr className="rule rule--green" />
              {p.shortBio ? <p className="profile__bio">{p.shortBio}</p> : <p className="profile__bio muted">Biography coming soon.</p>}
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
