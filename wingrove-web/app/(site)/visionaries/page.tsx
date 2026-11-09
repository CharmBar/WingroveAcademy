import type { Metadata } from 'next'
import { GivingBand, PageHero } from '@/components/Blocks'
import { PersonCard } from '@/components/Person'
import { getTeam, getVisiblePeople } from '@/lib/pages'

export const revalidate = 60
export const metadata: Metadata = { title: 'The Visionaries', description: 'The founders and team building Wingrove Academy.' }

export default async function VisionariesPage() {
  const [t, people] = await Promise.all([getTeam(), getVisiblePeople()])
  const leaders = t.showLeadership ? people.filter((p) => p.group !== 'advancement') : []
  const advancement = people.filter((p) => p.group === 'advancement')
  return (
    <>
      <PageHero image={t.hero} eyebrow={t.heroEyebrow} title={t.heroTitle} lead={t.heroLead} />

      <section className="band mission">
        <div className="wrap">
          <div className="mission__body">
            {t.body.map((p, i) =>
              i === 0 ? (
                <p className="lead" key={i}>
                  {p}
                </p>
              ) : (
                <p key={i}>{p}</p>
              ),
            )}
          </div>
        </div>
      </section>

      {[
        { title: t.leadershipTitle, intro: t.leadershipIntro, list: leaders, id: 'leadership' },
        { title: t.advancementTitle, intro: t.advancementIntro, list: advancement, id: 'advancement' },
      ].map((g) =>
        g.list.length ? (
          <section className="band team" id={g.id} key={g.id}>
            <div className="wrap">
              <h2 className="h2">{g.title}</h2>
              <hr className="rule rule--green" />
              <p className="section-lead">{g.intro}</p>
              <div className="team__grid">
                {g.list.map((p) => (
                  <PersonCard key={p.slug} p={p} />
                ))}
              </div>
            </div>
          </section>
        ) : null,
      )}
      <GivingBand eyebrow={t.givingEyebrow} title={t.givingTitle} body={t.givingBody} button={t.givingButton} href={t.givingHref} />
    </>
  )
}
