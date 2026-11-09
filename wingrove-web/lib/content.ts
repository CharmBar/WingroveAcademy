/**
 * Content access. Published Sanity content wins field by field; anything not filled in yet
 * falls back to the approved copy and renderings below, so the site always renders.
 */
import { client, imageUrl, type SanityImage } from './sanity'

type Img = SanityImage & { alt?: string }
export type Pillar = { label: string; body: string }
export type Chapter = { eyebrow: string; title: string; body: string; linkLabel: string; href: string; image?: Img; fallback: string; alt: string }
export type Scene = { caption: string; image?: Img; fallback: string }

export const defaults = {
  settings: {
    title: 'Wingrove Academy',
    description: 'A private PK–12 school in the Village of Wellington, FL. Opening Fall 2029.',
    ctaLabel: 'Become an Insider',
    contactEmail: 'info@wingroveacademy.org',
    place: 'Village of Wellington, FL',
    instagram: '/wingroveacademy',
    linkedin: '/wingroveacademyofficial',
    credit: 'Renderings: Efficiency Lab for Architecture PLLC © 2026',
  },
  home: {
    openingLine: 'Village of Wellington, FL · Opening Fall 2029',
    tagline: 'Where Excellence Finds Purpose',
    scenes: [
      { caption: 'Performing Arts Courtyard', fallback: 'courtyard' },
      { caption: 'Middle School Commons', fallback: 'commons' },
    ] as Scene[],
    closingLine: 'World-class private PK–12 education for Palm Beach County.',
    welcomeLead:
      'Designed for depth of learning and distinction in individual achievement, Wingrove Academy pairs an original PK–12 curriculum with a school calendar structured for sustained inquiry, exploration, and application.',
    welcomeBody:
      'Students will have the time and guidance to master complex ideas, develop individual strengths to an exceptional level, and cultivate the independence and judgment to lead, innovate, and shape the institutions and communities of the future.',
    welcomeNote: 'Creating the Epicenter for Innovation and Excellence in the Village of Wellington, FL.',
    distinctTitle: 'What Makes Wingrove Distinctive',
    distinctIntro: 'The choice is not between the outdated and the experimental. Wingrove advances what the best schools do well and redesigns what they do not.',
    pillars: [
      { label: 'Ecosystem Catalyst', body: 'Most schools serve only the students inside them. Wingrove is built to strengthen the region too, opening professional development, research, and faculty to schools across Palm Beach County.' },
      { label: 'Talent Magnet', body: 'Nothing shapes a child’s education more than the people who teach them. Wingrove is built as a place the best educators choose.' },
      { label: 'Global Connectivity', body: 'It begins close to home and grows outward, through real partnerships built over decades that bring the world into every student’s education.' },
      { label: 'Time Advantage', body: 'The schedule conforms to the learning. We build the day, the week, and the year around what learning requires: depth, agency, and room to go further.' },
      { label: 'Bespoke Curriculum', body: 'Designed from first principles, not convention. A credential built on our own curriculum, not a standardized one. A Wingrove diploma is one-of-one.' },
    ] as Pillar[],
    visionQuote:
      'Our vision for Wingrove Academy is to create an unparalleled, future-focused school that nurtures citizens with not just academic skills but also the resilience, adaptability, and global perspective to pursue their passions and lead and serve with clarity, compassion, and purpose.',
    visionName: 'Karen Yung',
    visionRole: 'Founder, ElevateED',
    chaptersTitle: 'A 43.8-acre campus built for how students learn best.',
    chapters: [
      { eyebrow: 'The Learning Experience', title: 'The Time and Space to Pursue Excellence', body: 'Distinct Lower, Middle, and Upper School models, five-week learning modules and three-week intersessions.', linkLabel: 'Explore learning', href: '/learning-experience', fallback: 'classroom', alt: 'Exchange classroom with an oval seminar table and students at the whiteboard' },
      { eyebrow: 'The Campus', title: 'An Exceptional Setting for Learning and Growth', body: 'Academic, arts, and athletics facilities connected through open green space and lakes.', linkLabel: 'Explore the campus', href: '/campus', fallback: 'campus', alt: 'Illustrated aerial view of the Wingrove campus with its lakes, academic buildings and athletic fields' },
      { eyebrow: 'The Visionaries', title: 'Global Experience, A Shared Ambition', body: 'The founders and advancement team building Wingrove, with experience designing, opening, and guiding distinguished schools around the world.', linkLabel: 'Meet the team', href: '/visionaries', fallback: 'dining', alt: 'Dining courtyard with students gathered on the lawn under a shade tree' },
    ] as Chapter[],
    insiderEyebrow: 'Become an Insider',
    insiderTitle: 'A Legacy in the Making',
    insiderSubtitle: 'Follow the vision taking shape for generations to come.',
    insiderBody:
      'Wingrove Academy represents a lasting commitment to the future of education and the Palm Beach County community. Follow our journey as we bring this vision to life, from the development of our campus to the people, programs, and partnerships that will shape generations of learners.',
    insiderPerks: [
      'Discover the vision and progress behind our future campus',
      'Hear from the founders, educators, and community shaping Wingrove',
      'Receive early updates on admissions, milestones, and special events',
    ],
    insiderButton: 'Follow Our Journey',
  },
}

const pick = <T,>(v: T | null | undefined | '', d: T): T => (v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0) ? d : v)

async function fetchDoc<T>(id: string): Promise<Partial<T>> {
  if (!client) return {}
  try {
    return ((await client.fetch(`*[_id == $id][0]`, { id }, { next: { revalidate: 60 } })) as Partial<T>) || {}
  } catch (e) {
    console.error('Sanity fetch failed', id, e)
    return {}
  }
}

export async function getSettings() {
  const s = await fetchDoc<typeof defaults.settings & { ogImage?: Img }>('siteSettings')
  const d = defaults.settings
  return {
    title: pick(s.title, d.title),
    description: pick(s.description, d.description),
    ctaLabel: pick(s.ctaLabel, d.ctaLabel),
    contactEmail: pick(s.contactEmail, d.contactEmail),
    place: pick(s.place, d.place),
    instagram: pick(s.instagram, d.instagram),
    linkedin: pick(s.linkedin, d.linkedin),
    credit: pick(s.credit, d.credit),
    ogImage: imageUrl(s.ogImage, 1200, 630),
  }
}

/** Local rendering (in /public/media) unless an image was uploaded in Sanity. */
export const media = (img: Img | undefined, fallback: string, width = 2400) => ({
  src: imageUrl(img, width) || `/media/${fallback}.webp`,
  srcSet: img?.asset?._ref ? undefined : `/media/${fallback}-sm.webp 1200w, /media/${fallback}.webp 3000w`,
})

export async function getHome() {
  const h = await fetchDoc<Record<string, any>>('homePage')
  const d = defaults.home
  const scenes: Scene[] = d.scenes.map((s, i) => ({ ...s, ...(h.scenes?.[i] || {}), caption: pick(h.scenes?.[i]?.caption, s.caption) }))
  const chapters: Chapter[] = d.chapters.map((c, i) => {
    const x = h.chapters?.[i] || {}
    return {
      ...c,
      eyebrow: pick(x.eyebrow, c.eyebrow),
      title: pick(x.title, c.title),
      body: pick(x.body, c.body),
      linkLabel: pick(x.linkLabel, c.linkLabel),
      href: pick(x.href, c.href),
      image: x.image,
      alt: pick(x.image?.alt, c.alt),
    }
  })
  const text = (k: keyof typeof d) => pick(h[k as string], d[k]) as string
  return {
    heroImage: h.heroImage as Img | undefined,
    openingLine: text('openingLine'),
    tagline: text('tagline'),
    scenes,
    closingLine: text('closingLine'),
    welcomeLead: text('welcomeLead'),
    welcomeBody: text('welcomeBody'),
    welcomeNote: text('welcomeNote'),
    distinctTitle: text('distinctTitle'),
    distinctIntro: text('distinctIntro'),
    pillars: pick(h.pillars as Pillar[], d.pillars),
    visionQuote: text('visionQuote'),
    visionName: text('visionName'),
    visionRole: text('visionRole'),
    visionImage: h.visionImage as Img | undefined,
    chaptersTitle: text('chaptersTitle'),
    chapters,
    insiderEyebrow: text('insiderEyebrow'),
    insiderTitle: text('insiderTitle'),
    insiderSubtitle: text('insiderSubtitle'),
    insiderBody: text('insiderBody'),
    insiderPerks: pick(h.insiderPerks as string[], d.insiderPerks),
    insiderButton: text('insiderButton'),
  }
}
