/**
 * Content for The Learning Experience, The Campus and The Visionaries.
 * Sanity content wins field by field; the approved copy below fills anything not entered yet.
 * Sources: Figma "Wingrove Site - Revised Nov 3", WA26 brochure and WA26 Brand Update.
 */
import { client, imageUrl, type SanityImage } from './sanity'

type Img = SanityImage & { alt?: string }
export type Pic = { src: string; srcSet?: string; alt: string; caption?: string }

const pick = <T,>(v: T | null | undefined | '', d: T): T => (v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0) ? d : v)

/** A local rendering in /public/media, unless an image was uploaded in Sanity. */
export function pic(img: Img | undefined, fallback: string, alt: string, caption?: string, width = 2400): Pic {
  const up = imageUrl(img, width)
  return up
    ? { src: up, alt: img?.alt || alt, caption }
    : { src: `/media/${fallback}.webp`, srcSet: `/media/${fallback}-sm.webp 1200w, /media/${fallback}.webp 2400w`, alt, caption }
}

async function fetchQuery<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!client) return null
  try {
    return (await client.fetch(query, params, { next: { revalidate: 60 } })) as T
  } catch (e) {
    console.error('Sanity fetch failed', query.slice(0, 60), e)
    return null
  }
}

const doc = async (id: string) => (await fetchQuery<Record<string, any>>(`*[_id == $id][0]`, { id })) || {}

type GalleryItem = { image?: Img; caption?: string }
/** Gallery items from the Studio, matched by position to the default renderings: a caption or image left empty keeps the default. */
const gallery = (items: GalleryItem[] | undefined, d: { fallback: string; caption: string; alt: string }[]): Pic[] => {
  const list = items?.length ? items : d.map(() => ({}) as GalleryItem)
  return list.map((g, i) => {
    const def = d[i] || d[i % d.length]
    const caption = g.caption || def.caption
    return pic(g.image, def.fallback, g.image?.alt || def.alt, caption, 1600)
  })
}

/* ---------------- The Learning Experience ---------------- */

export type RhythmBlock = { weeks: number; label: string; detailTitle: string; detailBody: string }
export type Division = { name: string; grades: string; stage: string; focus: string; body: string }
type Img2 = SanityImage & { alt?: string }
export type ProgramStage = { title: string; body: string }
export type Program = { name: string; image?: Img2; fallback?: string; alt?: string; lower: ProgramStage; middle: ProgramStage; upper: ProgramStage }
export type ProgramView = { name: string; image: Pic; stages: ProgramStage[] }

export const learningDefaults = {
  heroEyebrow: 'The Learning Experience',
  heroTitle: 'The Time and Space to Pursue Excellence',
  heroLead:
    'Wingrove’s original PK–12 curriculum will integrate rigorous academics, applied learning, the arts, athletics, and global experiences.',
  introLead: 'At Wingrove, learning is personal. Students are encouraged to explore big ideas, follow their curiosities, and push the boundaries of what’s possible.',
  introBody:
    'Whether launching a business, conducting research, competing on the world stage, or creating something entirely new, every student is supported in discovering their strengths and turning them into impact.',
  divisionsTitle: 'Lower, Middle, and Upper School',
  divisionsSubtitle: 'From Curiosity to Mastery. From Discovery to Distinction.',
  divisionsBody:
    'Wingrove’s Lower, Middle, and Upper Schools are designed as one connected journey. Each division builds on the foundations of the last while responding to the distinct developmental needs of its students. The progression is deliberate: discover and explore, develop and apply, distinguish and contribute.',
  divisionCards: [
    { name: 'Lower School', grades: 'PK–4', stage: 'Discover', focus: 'Curiosity, Exploration & Foundations', body: 'Establish a love of learning through joyful discovery, strong foundations, creative expression, and the confidence to explore new ideas.' },
    { name: 'Middle School', grades: '5–8', stage: 'Develop', focus: 'Inquiry, Application & Agency', body: 'Deepen understanding through interdisciplinary inquiry, authentic problem-solving, and growing ownership of learning, interests, and responsibilities.' },
    { name: 'Upper School', grades: '9–12', stage: 'Distinguish', focus: 'Mastery, Purpose & Impact', body: 'Pursue intellectual depth and individual distinction through advanced scholarship, original work, and purposeful contributions beyond the classroom.' },
  ] as Division[],
  showPrograms: false,
  programsEyebrow: 'Signature Programs',
  programsTitle: 'Distinct programs. One connected journey.',
  programsBody:
    'From foundational discovery to advanced achievement, Wingrove’s signature programs deepen students’ knowledge, skills, and independence at every stage. Programs such as Mathematics; Arts, Design & Entrepreneurship; and Athletics, Wellness & Movement are integral to every student’s experience, building essential capabilities while opening paths to pursue individual strengths to an exceptional level.',
  programs: [
    {
      name: 'Mathematics',
      fallback: 'classroom',
      alt: 'Students working through problems at the whiteboard in an exchange classroom',
      lower: { title: 'Explore & Build', body: 'Develop confidence with numbers, patterns, and mathematical reasoning through exploration, inquiry, and creative problem-solving.' },
      middle: { title: 'Apply & Solve', body: 'Build fluency with increasingly complex concepts in geometry, statistics, probability, and coding, applying mathematics to real-world challenges.' },
      upper: { title: 'Advance & Pioneer', body: 'Pursue mathematics beyond traditional grade levels, with opportunities for advanced research, original proofs, data science, and mathematical innovation.' },
    },
    {
      name: 'Arts, Design & Entrepreneurship',
      fallback: 'workshop',
      alt: 'Students building and testing ideas in the workshop',
      lower: { title: 'Imagine & Create', body: 'Build foundational skills in visual and performing arts, explore design principles, and develop confidence in expressing original ideas.' },
      middle: { title: 'Design & Collaborate', body: 'Use design thinking to prototype solutions, create original work, and develop entrepreneurial skills through projects with authentic audiences.' },
      upper: { title: 'Innovate & Launch', body: 'Master creative disciplines, develop professional portfolios, and launch original projects or ventures through mentorship, production, and real-world engagement.' },
    },
    {
      name: 'Athletics, Wellness & Movement',
      fallback: 'innovation-commons',
      alt: 'Indoor competition pool with swimmers in the lanes and a sunlit spectator walkway',
      lower: { title: 'Move & Grow', body: 'Develop coordination, swimming proficiency, physical confidence, and healthy habits through daily movement, play, and sports exploration.' },
      middle: { title: 'Train & Strengthen', body: 'Build strength, speed, agility, and sport-specific skills while developing resilience, teamwork, and lifelong wellness practices.' },
      upper: { title: 'Perform & Thrive', body: 'Pursue excellence in competitive sports, refine athletic performance, and build lifelong practices in physical conditioning, recovery, nutrition, and wellbeing.' },
    },
  ] as Program[],
  timeTitle: 'Time Advantage',
  timeBody:
    'At Wingrove, the schedule conforms to the learning. Time is a design resource, and we build the day, the week, and the year around what learning requires: depth, agency, and room to go further.',
  rhythmTitle: 'A different rhythm of learning',
  rhythm: [
    { weeks: 5, label: 'Focused learning', detailTitle: 'Longer class periods', detailBody: 'Time to explore ideas without constant interruption.' },
    { weeks: 3, label: 'Intersession', detailTitle: 'Protected project time', detailBody: 'Time to investigate, create, and apply learning.' },
  ] as RhythmBlock[],
  rhythmCaption: 'Conceptual illustration of the two scheduling structures, not a literal calendar sequence.',
  timeNote: 'Together they allow students to explore ideas in depth and apply their knowledge through research, creative pursuits, and sustained projects.',
  thirdTitle: 'A “Third” Way',
  thirdBody:
    'The choice is not between the outdated and the experimental. Wingrove advances what the best schools do well and redesigns what they do not. Our model is built at the intersections that prepare students for the most selective pursuits and for lives of strong judgment, deep purpose, and real responsibility.',
  thirdItems: [
    { label: 'Tradition & Innovation', body: 'Where timeless disciplines meet modern applications of learning.' },
    { label: 'Rigor & Wellbeing', body: 'Where challenge is met by care.' },
    { label: 'Depth & Partnership', body: 'Where scholarship leads to direction.' },
    { label: 'Self & Society', body: 'Where personal growth meets responsibility to others.' },
  ],
  curriculumTitle: 'Bespoke Curriculum',
  curriculumBody:
    'Wingrove is designed from first principles, not convention. A credential built on our own curriculum, not a standardized one. The world’s most selective schools have moved in this direction. A Wingrove diploma is one-of-one.',
  scaleBody: 'Designed to serve more than 1,000 students, Wingrove will offer the breadth and specialization to develop exceptional strengths across disciplines.',
  galleryTitle: 'Spaces for Learning',
  gallery: [
    { fallback: 'classroom-english', caption: 'Exchange Classroom', alt: 'Exchange classroom with an oval seminar table and student work on the walls' },
    { fallback: 'innovation-workshop', caption: 'Innovation Center Workshop', alt: 'Students working at long tables in the bright Innovation Center workshop' },
    { fallback: 'upper-commons', caption: 'Upper School Commons', alt: 'Upper School commons with stepped wooden seating and a large screen' },
    { fallback: 'workshop', caption: 'Workshop', alt: 'Workshop with lab benches, stools and orange pendant lights' },
    { fallback: 'innovation-commons', caption: 'Innovation Center Commons', alt: 'Innovation Center commons with lounge seating and a reception desk' },
    { fallback: 'classroom', caption: 'Exchange Classroom', alt: 'Students solving equations at the whiteboard in an exchange classroom' },
  ],
}

export async function getLearning() {
  const s = await doc('learningPage')
  const d = learningDefaults
  const t = (k: keyof typeof d) => pick(s[k as string], d[k]) as string
  return {
    hero: pic(s.heroImage, 'innovation-workshop', 'Students at work in the Innovation Center workshop'),
    heroEyebrow: t('heroEyebrow'),
    heroTitle: t('heroTitle'),
    heroLead: t('heroLead'),
    introLead: t('introLead'),
    introBody: t('introBody'),
    divisionsTitle: t('divisionsTitle'),
    divisionsBody: t('divisionsBody'),
    divisionsSubtitle: t('divisionsSubtitle'),
    divisionCards: pick(s.divisionCards as Division[], d.divisionCards),
    showPrograms: s.showPrograms === true,
    programsEyebrow: t('programsEyebrow'),
    programsTitle: t('programsTitle'),
    programsBody: t('programsBody'),
    programs: (pick(s.programs as Program[], d.programs) as Program[]).map((p, i): ProgramView => {
      const def = d.programs[i] || d.programs[0]
      return {
        name: p.name || def.name,
        image: pic(p.image, p.fallback || def.fallback || 'classroom', p.image?.alt || p.alt || def.alt || '', undefined, 1800),
        stages: (['lower', 'middle', 'upper'] as const).map((k) => ({ title: p[k]?.title || '', body: p[k]?.body || '' })),
      }
    }),
    timeTitle: t('timeTitle'),
    timeBody: t('timeBody'),
    rhythmTitle: t('rhythmTitle'),
    rhythm: (pick(s.rhythm as RhythmBlock[], d.rhythm) as RhythmBlock[]).filter((b) => b && Number(b.weeks) > 0).slice(0, 2),
    rhythmCaption: t('rhythmCaption'),
    timeNote: t('timeNote'),
    timeImage: pic(s.timeImage, 'campus-walk-2', 'Students and a teacher talking along a bright second-floor walkway'),
    thirdTitle: t('thirdTitle'),
    thirdBody: t('thirdBody'),
    thirdItems: pick(s.thirdItems as { label: string; body: string }[], d.thirdItems),
    curriculumTitle: t('curriculumTitle'),
    curriculumBody: t('curriculumBody'),
    scaleBody: t('scaleBody'),
    galleryTitle: t('galleryTitle'),
    gallery: gallery(s.gallery, d.gallery),
  }
}

/* ---------------- The Campus ---------------- */

export type Area = { n: number; label: string; x: number; y: number; note?: string; kind?: 'letter' | 'number' }
/** A site plan marker ready to show: its mark (A, B… or 1, 2…), its style, and where it sits in the list. */
export type PlanMark = Area & { mark: string; kind: 'letter' | 'number'; i: number }

/**
 * Letters are given in list order (A, B, C…); numbers show the number entered, so two markers can
 * share one (both Gate Houses are 1). Areas not yet set to Letter or Number: 1 and 2 stay numbers,
 * the rest become letters.
 */
export function planMarks(areas: Area[]): PlanMark[] {
  let letter = 0
  return areas
    .filter((a) => a && a.label && Number.isFinite(Number(a.x)) && Number.isFinite(Number(a.y)))
    .map((a, i) => {
      const kind: 'letter' | 'number' = a.kind || (Number(a.n) > 0 && Number(a.n) <= 2 ? 'number' : 'letter')
      const mark = kind === 'letter' ? (letter < 26 ? String.fromCharCode(65 + letter++) : String(++letter)) : String(a.n ?? '')
      return { ...a, kind, mark, i }
    })
}

export const campusDefaults = {
  heroEyebrow: 'The Campus',
  heroTitle: 'An Exceptional Setting for Learning and Growth',
  heroLead: 'Across 43.8 acres in the Village of Wellington, Wingrove’s campus will give physical form to its educational vision.',
  facts: [
    { value: '43.8', label: 'Acres in the Village of Wellington' },
    { value: '1,000', label: 'Seats at opening, with room to grow' },
    { value: 'PK–12', label: 'Lower, Middle, and Upper School' },
    { value: 'Fall 2029', label: 'Opening' },
  ],
  regionTitle: 'South Florida is in the midst of a once-in-a-generation transformation.',
  regionBody: [
    'Palm Beach County is growing and needs a top-tier school to serve families who value excellence and possibility for their children. The opportunity is not to replicate what exists, but to improve it and build a school that redefines what excellence means.',
    'Wingrove Academy is the next generation of world-class education, bringing together leaders with unrivaled expertise in designing and launching schools of global stature. We are building a school that delivers both excellence and purpose, academic distinction and human development.',
  ],
  storyTitle: 'Creating the Epicenter for Innovation and Excellence',
  storyBody: [
    'Wingrove Academy’s sustainable campus is purpose-built to support how students learn best, through exploration, creation, and connection. Designed by internationally acclaimed architects, the campus integrates classrooms, labs, and studios with open green spaces, encouraging collaboration, movement, and discovery throughout the day.',
    'Situated on a 43.8-acre site, Wingrove is designed to open as a 1,000-seat, world-class PK–12 institution, with the flexibility to expand as the region grows. State-of-the-art facilities for the arts and athletics sit at the heart of campus life, alongside adaptable learning environments that foster focus, creativity, and meaningful connection.',
    'Every detail is intentional. Because when students are inspired by where they learn, they are better prepared to become who they are meant to be.',
  ],
  planTitle: 'Explore the Campus',
  planIntro: 'Select a letter or number on the plan, or a name in the list, to find each part of the campus.',
  // Positions are percentages across and down the illustrated plan; adjust them in the Studio.
  areas: [
    { kind: 'letter', n: 3, label: 'Innovation Center', x: 35.9, y: 46.4 },
    { kind: 'letter', n: 4, label: 'Lower School', x: 51.4, y: 31.3 },
    { kind: 'letter', n: 5, label: 'Athletic Building', x: 17.7, y: 45.4 },
    { kind: 'letter', n: 6, label: 'Aquatics Center', x: 23, y: 50 },
    { kind: 'letter', n: 7, label: 'Village Center', x: 30.5, y: 40.5 },
    { kind: 'letter', n: 8, label: 'Main Track & Field', x: 30.9, y: 67.4 },
    { kind: 'letter', n: 9, label: 'Middle and Upper School', x: 46, y: 54 },
    { kind: 'letter', n: 10, label: 'Tennis Center', x: 45.7, y: 61.3 },
    { kind: 'letter', n: 11, label: 'Theater', x: 19.7, y: 34.2 },
    { kind: 'letter', n: 12, label: 'Softball Field', x: 68.2, y: 58.6 },
    { kind: 'letter', n: 13, label: 'Baseball Field', x: 71.5, y: 73 },
    { kind: 'letter', n: 14, label: 'Practice Fields', x: 49.4, y: 71.3 },
    { kind: 'letter', n: 15, label: 'Parking Garage', x: 13.6, y: 61.5 },
    { kind: 'number', n: 1, label: 'Gate Houses', x: 60.2, y: 83.4 },
    { kind: 'number', n: 1, label: 'Gate Houses', x: 25, y: 33 },
    { kind: 'number', n: 2, label: 'Drop-off / Pick-up', x: 54.6, y: 56.2 },
  ] as Area[],
  galleryTitle: 'Around Campus',
  gallery: [
    { fallback: 'campus-walk', caption: 'Campus Walk', alt: 'Glass-walled gathering space along the campus walk with students at tables and an orange spiral stair' },
    { fallback: 'dining', caption: 'Dining Courtyard', alt: 'Students on the lawn of the dining courtyard under a large shade tree' },
    { fallback: 'courtyard', caption: 'Performing Arts Courtyard', alt: 'Performing arts courtyard lawn with the observatory dome beyond' },
    { fallback: 'campus-walk-2', caption: 'Campus Walk, Second Floor', alt: 'Students and a teacher along the bright second-floor walkway' },
    { fallback: 'axon', caption: 'Innovation Center', alt: 'Model view of the Innovation Center and the academic buildings around it' },
    { fallback: 'commons', caption: 'Middle School Commons', alt: 'Students on the stepped wooden seating of the Middle School commons' },
  ],
  closing: 'Opening in Fall 2029, the campus is conceived as an enduring educational and civic anchor, enriching Palm Beach County through learning, culture, and community connection.',
}

export async function getCampus() {
  const s = await doc('campusPage')
  const d = campusDefaults
  const t = (k: keyof typeof d) => pick(s[k as string], d[k]) as string
  const planUp = imageUrl(s.planImage, 2400)
  return {
    hero: pic(s.heroImage, 'arts-courtyard', 'Performing arts courtyard with students crossing the plaza beneath a red canopy'),
    heroEyebrow: t('heroEyebrow'),
    heroTitle: t('heroTitle'),
    heroLead: t('heroLead'),
    facts: pick(s.facts as { value: string; label: string }[], d.facts),
    regionTitle: t('regionTitle'),
    regionBody: pick(s.regionBody as string[], d.regionBody),
    storyTitle: t('storyTitle'),
    storyBody: pick(s.storyBody as string[], d.storyBody),
    planTitle: t('planTitle'),
    planIntro: t('planIntro'),
    plan: planUp ? { src: planUp, srcSet: undefined } : { src: '/media/campus.webp', srcSet: '/media/campus-sm.webp 900w, /media/campus.webp 1246w' },
    areas: planMarks(pick(s.areas as Area[], d.areas)),
    street: {
      label: s.streetLabel === '' ? '' : pick(s.streetLabel as string, 'Stribling Way'),
      x: Number.isFinite(s.streetX) ? Number(s.streetX) : 24,
      y: Number.isFinite(s.streetY) ? Number(s.streetY) : 19.6,
    },
    galleryTitle: t('galleryTitle'),
    gallery: gallery(s.gallery, d.gallery),
    closing: t('closing'),
  }
}

/* ---------------- The Visionaries ---------------- */

export type Person = {
  name: string
  slug: string
  role?: string
  group: 'leadership' | 'advancement' | 'founder' | 'advisor'
  order: number
  /** Set when someone outside Leadership also appears in Founding Leadership, at this position. */
  leadershipOrder?: number | null
  photo?: string | null
  shortBio?: string
  quote?: string
}

export const teamDefaults = {
  heroEyebrow: 'The Visionaries',
  heroTitle: 'Global Experience, A Shared Ambition for Wingrove.',
  heroLead: 'Wingrove brings together internationally accomplished educators and leaders with experience designing, opening, and guiding distinguished schools around the world.',
  body: [
    'Wingrove Academy is being built by people who have done this before, at the highest levels, at the institutions that set the standard. That expertise comes from Karen Yung and the team she has assembled at ElevateED to build and support Wingrove.',
    'Our team has designed and led Avenues: The World School in New York, Green School in Bali, Dulwich College International across Asia, and Da Vinci Schools in Los Angeles. They have taught at High Tech High and the University of Cambridge, led major philanthropic campaigns, and scaled talent infrastructure at Teach for America. Our athletics program is being designed by leaders from the University of Delaware and Iowa State. Our construction team has overseen capital projects at The Dalton School and Horace Mann.',
  ],
  showLeadership: false,
  leadershipTitle: 'Founding Leadership',
  leadershipIntro: 'The ElevateED team designing Wingrove’s academic model, campus, and organization.',
  advancementTitle: 'Advancement',
  advancementIntro: 'The team building the community of families, donors, and partners behind Wingrove.',
  givingEyebrow: 'Advancement',
  givingTitle: 'Commitment from this community. Opportunity for generations to come.',
  givingBody: [
    'A school like Wingrove doesn’t just appear. It’s built—step by step, gift by gift—by a community that believes every child deserves a place to grow, to learn, and to flourish.',
    'The future of education is being written now. With your support, it will soar at Wingrove Academy.',
  ],
  givingButton: 'Help Shape an Enduring Institution',
  givingHref: '/founding-opportunity',
}

const P = (name: string, slug: string, group: Person['group'], order: number, role?: string): Person => ({ name, slug, group, order, role })
/** Used only until the team is entered in Sanity (bios and photos live there). */
export const peopleDefaults: Person[] = [
  P('Karen Yung', 'karen-yung', 'leadership', 10, 'Founder'),
  P('Jeff Clark', 'jeff-clark', 'leadership', 20, 'Chair & CEO'),
  P('Min Kim', 'min-kim', 'leadership', 30, 'Chief Financial and Operating Officer'),
  P('Dr. Nicole Assisi', 'nicole-assisi', 'leadership', 40, 'Senior Advisor'),
  P('Edward Huang', 'edward-huang', 'leadership', 50, 'Chief Innovation Officer'),
  P('Jason Zubatkin', 'jason-zubatkin', 'leadership', 60, 'Managing Director, Design & Construction'),
  { ...P('Chrissi Rawak', 'chrissi-rawak', 'advancement', 110, 'Managing Director, Advancement & Organizational Excellence'), leadershipOrder: 55 },
  { ...P('Amanda Hoskins', 'amanda-hoskins', 'advancement', 120, 'Director, Data Strategy & Operations'), leadershipOrder: 65 },
  P('Shannan Brown', 'shannan-brown', 'advancement', 130),
  P('Ashley Stone', 'ashley-stone', 'advancement', 140),
  P('Jeff Foss', 'jeff-foss', 'advancement', 150),
  P('Jennifer Childs', 'jennifer-childs', 'advancement', 160),
  P('Samantha Huge', 'samantha-huge', 'advancement', 170),
  P('Tom Bliss', 'tom-bliss', 'advancement', 180),
]

const PEOPLE_Q = `*[_type == "person" && (!defined(access) || access == "public")] | order(order asc){
  name, "slug": slug.current, role, group, order, leadershipOrder, shortBio, quote, "photo": photo.asset->url
}`

export async function getPeople(): Promise<Person[]> {
  const rows = await fetchQuery<Person[]>(PEOPLE_Q)
  return rows?.length ? rows.filter((p) => p.slug) : peopleDefaults
}

/** People shown on the site: the leadership group only when The Visionaries page has it switched on. */
export async function getVisiblePeople(): Promise<Person[]> {
  const [people, s] = await Promise.all([getPeople(), doc('teamPage')])
  return s.showLeadership === true ? people : people.filter((p) => p.group === 'advancement')
}

/** Founding Leadership: the Leadership group plus anyone given a leadership position, in that order. */
export const leadershipList = (people: Person[]) =>
  people
    .filter((p) => p.group !== 'advancement' || typeof p.leadershipOrder === 'number')
    .sort((a, b) => (a.leadershipOrder ?? a.order) - (b.leadershipOrder ?? b.order))

export async function getPerson(slug: string) {
  return (await getVisiblePeople()).find((p) => p.slug === slug) || null
}

export async function getTeam() {
  const s = await doc('teamPage')
  const d = teamDefaults
  const t = (k: keyof typeof d) => pick(s[k as string], d[k]) as string
  return {
    hero: pic(s.heroImage, 'dining', 'Students gathered on the lawn of the dining courtyard'),
    heroEyebrow: t('heroEyebrow'),
    heroTitle: t('heroTitle'),
    heroLead: t('heroLead'),
    body: pick(s.body as string[], d.body),
    showLeadership: s.showLeadership === true,
    showAdvancement: s.showAdvancement !== false,
    leadershipTitle: t('leadershipTitle'),
    leadershipIntro: t('leadershipIntro'),
    advancementTitle: t('advancementTitle'),
    advancementIntro: t('advancementIntro'),
    givingEyebrow: t('givingEyebrow'),
    givingTitle: t('givingTitle'),
    givingBody: pick(s.givingBody as string[], d.givingBody),
    givingButton: t('givingButton'),
    givingHref: t('givingHref'),
  }
}

/* ---------------- A Founding Opportunity (donor page, not in the navigation) ---------------- */

export type Stat = { value: string; label: string; countUp?: boolean }

export const givingDefaults = {
  heroEyebrow: 'Advancement',
  heroTitle: 'A Founding Opportunity',
  heroLead: 'Help shape an enduring institution.',
  intro: [
    'Exceptional schools shape generations. Wingrove Academy’s founding offers a rare opportunity to help establish one, bringing a distinctive vision of educational excellence to Palm Beach County.',
    'Designed for depth of learning and distinction in individual achievement, Wingrove will unite rigorous academics, applied learning, the arts, and athletics. Students will have the time and guidance to develop exceptional strengths and the independence and judgment to lead, innovate, and shape the institutions and communities of the future.',
    'Founding philanthropy will help establish this standard from the beginning, influencing the caliber of educators, depth of programming, and culture that will define Wingrove for generations.',
  ],
  quotes: [
    {
      quote: 'Teaching children the same way we were taught 50 years ago is probably not the best way forward. Families like mine value a school that is thinking about the future and how best to prepare our children for it.',
      attribution: 'Prospective Parent',
    },
    {
      quote: 'Wingrove will not simply fill a need; it will set a precedent. Combining strong academics with real-world application, empowering children to think deeply and develop individual strengths, and maintaining a clear focus on safety and security.',
      attribution: 'Prospective Parent',
    },
  ],
  supportTitle: 'What Your Support Makes Possible',
  supportItems: [
    { label: 'Exceptional Educators', body: 'Attract accomplished faculty and school leaders who will bring Wingrove’s educational vision to life and guide students toward exceptional achievement.' },
    { label: 'Distinctive Learning', body: 'Develop an original PreK–12 curriculum that connects academic depth with applied learning, artistic expression, athletic development, and global experiences.' },
    { label: 'An Enduring Campus', body: 'Create purpose-built academic, arts, and athletics facilities across 43.8 acres in Wellington, establishing an educational and civic anchor for Palm Beach County.' },
  ],
  statsTitle: 'A Shared Vision. Growing Commitment.',
  stats: [
    { value: '$50.6 Million', label: 'Philanthropic Commitments to Date', countUp: true },
    { value: '$155 Million', label: 'Founding Capital Campaign' },
    { value: 'Fall 2029', label: 'Planned school opening' },
  ] as Stat[],
  giftEyebrow: 'Founding Philanthropy',
  giftTitle: 'Make a Founding Gift',
  giftSubtitle: 'Be part of Wingrove from the very beginning.',
  giftBody: 'Join the families and leaders helping bring Wingrove Academy to life. Your gift will help turn a founding vision into an enduring institution, with an influence that extends across generations.',
  giftPerks: [
    'Help attract the educators, programs, and campus that will define Wingrove',
    'Hear directly from the founders and advancement team shaping the school',
  ],
  formButton: 'Connect With Advancement',
  otherBody: 'To discuss a multiyear pledge, a gift of appreciated stock, or naming and recognition opportunities, connect with our advancement team.',
}

export async function getGiving() {
  const s = await doc('givingPage')
  const d = givingDefaults
  const t = (k: keyof typeof d) => pick(s[k as string], d[k]) as string
  return {
    hero: pic(s.heroImage, 'courtyard', 'The performing arts courtyard lawn with the observatory dome beyond'),
    heroEyebrow: t('heroEyebrow'),
    heroTitle: t('heroTitle'),
    heroLead: t('heroLead'),
    intro: pick(s.intro as string[], d.intro),
    quotes: (pick(s.quotes as { quote: string; attribution: string }[], d.quotes) || []).filter((q) => q && q.quote).slice(0, 3),
    quotesImage: imageUrl(s.quotesImage, 2000) || '/media/leaf.webp',
    supportTitle: t('supportTitle'),
    supportImage: pic(s.supportImage, 'campus-walk-2', 'A teacher talking with students along the bright second-floor walkway'),
    supportItems: pick(s.supportItems as { label: string; body: string }[], d.supportItems),
    statsTitle: t('statsTitle'),
    stats: pick(s.stats as Stat[], d.stats),
    statsImage: pic(s.statsImage, 'arts-courtyard', ''),
    giftEyebrow: t('giftEyebrow'),
    giftTitle: t('giftTitle'),
    giftSubtitle: t('giftSubtitle'),
    giftPerks: pick(s.giftPerks as string[], d.giftPerks),
    giftBody: t('giftBody'),
    formButton: t('formButton'),
    otherBody: t('otherBody'),
  }
}

/* ---------------- Why Wingrove ---------------- */

export const whyDefaults = {
  heroEyebrow: 'Why Wingrove',
  heroTitle: '',
  heroLead: '',
  indexTitle: 'At a glance',
}

/** Hero comes from the Why Wingrove document; the distinctions themselves are the home page's, so they are edited in one place. */
export async function getWhy() {
  const s = await doc('whyPage')
  const d = whyDefaults
  const t = (k: keyof typeof d) => pick(s[k as string], d[k]) as string
  return {
    hero: pic(s.heroImage, 'campus-walk', 'Students gathered in the glass-walled space along the campus walk'),
    heroEyebrow: t('heroEyebrow'),
    heroTitle: t('heroTitle'),
    heroLead: t('heroLead'),
    indexTitle: t('indexTitle'),
  }
}
