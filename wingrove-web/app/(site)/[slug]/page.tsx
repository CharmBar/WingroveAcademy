import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'
import { getSimplePage, getSimpleSlugs } from '@/lib/legal'

/** Simple pages edited in Studio → Pages (Privacy Policy…). Fixed routes like /campus always take priority. */
export const revalidate = 60
type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getSimpleSlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getSimplePage((await params).slug)
  return p ? { title: p.title, description: p.intro } : {}
}

export default async function SimplePageRoute({ params }: Props) {
  const p = await getSimplePage((await params).slug)
  if (!p) notFound()
  return (
    <section className="band legal">
      <div className="wrap legal__wrap">
        {p.eyebrow && <div className="eyebrow">{p.eyebrow}</div>}
        <h1>{p.title}</h1>
        {p.intro && <p className="legal__intro">{p.intro}</p>}
        {p.lastUpdated && <p className="legal__updated legal__updated--top">Last updated: {p.lastUpdated}</p>}
        <hr className="rule rule--green" />
        <div className="prose">
          <PortableText value={p.body || []} />
        </div>
      </div>
    </section>
  )
}
