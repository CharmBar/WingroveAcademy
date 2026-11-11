import { defineArrayMember, defineField, defineType } from 'sanity'

/** Who can see a piece of content: everyone, signed-up Insiders, or invited stakeholders (portal). */
const access = defineField({
  name: 'access',
  title: 'Who can see this',
  type: 'string',
  initialValue: 'public',
  options: {
    list: [
      { title: 'Everyone', value: 'public' },
      { title: 'Insiders (signed up)', value: 'insider' },
      { title: 'Invited stakeholders', value: 'portal' },
    ],
    layout: 'radio',
  },
})

const img = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'image',
    description,
    options: { hotspot: true },
    fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
  })

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', initialValue: 'Wingrove Academy' }),
    defineField({ name: 'description', type: 'text', rows: 3, description: 'Default search description.' }),
    defineField({ name: 'ctaLabel', title: 'Header button', type: 'string', description: 'The gold button in the header.' }),
    defineField({ name: 'contactEmail', type: 'string' }),
    defineField({ name: 'place', type: 'string', description: 'Shown in the footer, e.g. Village of Wellington, FL' }),
    defineField({ name: 'instagram', type: 'string', description: 'Handle as shown, e.g. /wingroveacademy' }),
    defineField({ name: 'linkedin', type: 'string', description: 'Handle as shown, e.g. /wingroveacademyofficial' }),
    defineField({ name: 'credit', title: 'Rendering credit', type: 'string', description: 'Not shown in the footer while the Wingrove Answerer placeholder is there.' }),
    defineField({ name: 'answererTitle', title: 'Wingrove Answerer: title', type: 'string' }),
    defineField({ name: 'answererStatus', title: 'Wingrove Answerer: status label', type: 'string', description: 'e.g. Coming soon' }),
    defineField({ name: 'answererText', title: 'Wingrove Answerer: description', type: 'text', rows: 3 }),
    img('ogImage', 'Default share image', '1200 × 630'),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    { name: 'opening', title: 'Opening', default: true },
    { name: 'welcome', title: 'Welcome' },
    { name: 'distinct', title: 'Distinctive' },
    { name: 'vision', title: 'Vision quote' },
    { name: 'chapters', title: 'Chapters' },
    { name: 'insider', title: 'Insider sign-up' },
  ],
  fields: [
    img('heroImage', 'Opening image', 'The wide campus elevation. Use the largest file you have (7,000+ px wide) so the zoom stays sharp.'),
    defineField({ name: 'openingLine', type: 'string', group: 'opening', description: 'Under the crest, e.g. Village of Wellington, FL · Opening Fall 2029' }),
    defineField({ name: 'tagline', type: 'string', group: 'opening' }),
    defineField({
      name: 'scenes',
      title: 'Zoom scenes',
      type: 'array',
      group: 'opening',
      description: 'Up to two renderings the zoom passes into after the entrance, in order.',
      validation: (r) => r.max(2),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [img('image', 'Image'), defineField({ name: 'caption', type: 'string' })],
          preview: { select: { title: 'caption', media: 'image' } },
        }),
      ],
    }),
    defineField({ name: 'closingLine', title: 'Closing line of the opening', type: 'string', group: 'opening' }),
    defineField({ name: 'welcomeLead', type: 'text', rows: 4, group: 'welcome' }),
    defineField({ name: 'welcomeBody', type: 'text', rows: 4, group: 'welcome' }),
    defineField({ name: 'welcomeNote', type: 'string', group: 'welcome' }),
    defineField({ name: 'distinctTitle', type: 'string', group: 'distinct' }),
    defineField({ name: 'distinctIntro', type: 'text', rows: 3, group: 'distinct' }),
    defineField({
      name: 'pillars',
      type: 'array',
      group: 'distinct',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string' }),
            defineField({ name: 'body', type: 'text', rows: 4 }),
            img('image', 'Image', 'Shown beside this card. Leave empty to use a matching campus rendering.'),
          ],
          preview: { select: { title: 'label', subtitle: 'body', media: 'image' } },
        }),
      ],
    }),
    defineField({ name: 'visionQuote', type: 'text', rows: 5, group: 'vision', description: 'Starts in italic; the first two words are set upright as in the brochure.' }),
    defineField({ name: 'visionName', type: 'string', group: 'vision' }),
    defineField({ name: 'visionRole', type: 'string', group: 'vision' }),
    img('visionImage', 'Background texture'),
    defineField({ name: 'chaptersTitle', type: 'string', group: 'chapters' }),
    defineField({
      name: 'chapters',
      type: 'array',
      group: 'chapters',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'eyebrow', type: 'string' }),
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'body', type: 'text', rows: 3 }),
            defineField({ name: 'linkLabel', type: 'string' }),
            defineField({ name: 'href', type: 'string', description: 'Page path, e.g. /campus' }),
            img('image', 'Image'),
          ],
          preview: { select: { title: 'title', subtitle: 'eyebrow', media: 'image' } },
        }),
      ],
    }),
    defineField({ name: 'insiderEyebrow', type: 'string', group: 'insider' }),
    defineField({ name: 'insiderTitle', type: 'string', group: 'insider' }),
    defineField({ name: 'insiderSubtitle', type: 'string', group: 'insider' }),
    defineField({ name: 'insiderBody', type: 'text', rows: 4, group: 'insider' }),
    defineField({ name: 'insiderPerks', type: 'array', group: 'insider', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'insiderButton', type: 'string', group: 'insider' }),
  ],
  preview: { prepare: () => ({ title: 'Home page' }) },
})

export const person = defineType({
  name: 'person',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'role', type: 'string' }),
    defineField({
      name: 'group',
      type: 'string',
      options: {
        list: [
          { title: 'Founders', value: 'founder' },
          { title: 'Advancement', value: 'advancement' },
          { title: 'Leadership', value: 'leadership' },
          { title: 'Advisors', value: 'advisor' },
        ],
      },
    }),
    defineField({ name: 'order', type: 'number' }),
    defineField({
      name: 'leadershipOrder',
      title: 'Also show in Founding Leadership',
      type: 'number',
      description: 'For someone outside the Leadership group (e.g. Advancement) who should also appear in Founding Leadership. Enter a position: leaders are sorted by their Order, so 55 places someone between 50 and 60. Leave empty to show them only in their own group.',
    }),
    img('photo', 'Photo'),
    defineField({ name: 'shortBio', type: 'text', rows: 5 }),
    defineField({ name: 'quote', type: 'text', rows: 5, description: 'Shown on the profile page. Leave a blank line between paragraphs.' }),
    access,
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
})


const text = (name: string, title?: string, rows = 3, group?: string) => defineField({ name, title, type: rows > 1 ? 'text' : 'string', rows: rows > 1 ? rows : undefined, group } as any)
const strings = (name: string, title?: string, group?: string) => defineField({ name, title, type: 'array', group, of: [defineArrayMember({ type: 'string' })] })
const paras = (name: string, title?: string, group?: string) => defineField({ name, title, type: 'array', group, description: 'One paragraph per item.', of: [defineArrayMember({ type: 'text', rows: 4 } as any)] })
const labelled = (name: string, title?: string, group?: string) =>
  defineField({
    name,
    title,
    type: 'array',
    group,
    of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'label', type: 'string' }), defineField({ name: 'body', type: 'text', rows: 2 })], preview: { select: { title: 'label', subtitle: 'body' } } })],
  })
const galleryField = (group?: string) =>
  defineField({
    name: 'gallery',
    type: 'array',
    group,
    description: 'In display order. Leave an image empty to keep the current rendering in that position.',
    of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'caption', type: 'string' }), img('image', 'Image')], preview: { select: { title: 'caption', media: 'image' } } })],
  })
const hero = (group = 'hero') => [
  { ...img('heroImage', 'Hero image'), group },
  text('heroEyebrow', 'Eyebrow', 1, group),
  text('heroTitle', 'Title', 1, group),
  text('heroLead', 'Lead', 3, group),
]

export const learningPage = defineType({
  name: 'learningPage',
  title: 'The Learning Experience',
  type: 'document',
  groups: [{ name: 'hero', title: 'Hero', default: true }, { name: 'body', title: 'Sections' }],
  fields: [
    ...hero(),
    text('introLead', 'Intro (large)', 3, 'body'),
    text('introBody', 'Intro', 3, 'body'),
    text('divisionsTitle', 'Schools title', 1, 'body'),
    text('divisionsSubtitle', 'Schools subtitle', 1, 'body'),
    text('divisionsBody', 'Schools text', 4, 'body'),
    defineField({
      name: 'divisionCards',
      title: 'School cards, in order',
      type: 'array',
      group: 'body',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', description: 'e.g. Lower School' }),
            defineField({ name: 'grades', type: 'string', description: 'e.g. PK–4' }),
            defineField({ name: 'stage', type: 'string', description: 'e.g. Discover' }),
            defineField({ name: 'focus', type: 'string', description: 'e.g. Curiosity, Exploration & Foundations' }),
            defineField({ name: 'body', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'name', subtitle: 'focus' } },
        }),
      ],
    }),
    defineField({ name: 'showPrograms', title: 'Show Signature Programs', type: 'boolean', group: 'body', initialValue: false, description: 'Off: hidden on the page. Preview it any time by adding ?preview=programs to the page address.' }),
    text('programsEyebrow', 'Programs: eyebrow', 1, 'body'),
    text('programsTitle', 'Programs: heading', 1, 'body'),
    text('programsBody', 'Programs: text', 4, 'body'),
    defineField({
      name: 'programs',
      title: 'Programs (example signature programs)',
      type: 'array',
      group: 'body',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string' }),
            img('image', 'Image'),
            defineField({ name: 'lower', title: 'Lower School (PK–4)', type: 'object', fields: [defineField({ name: 'title', type: 'string', description: 'Two verbs, e.g. Explore & Build' }), defineField({ name: 'body', type: 'text', rows: 3 })] }),
            defineField({ name: 'middle', title: 'Middle School (5–8)', type: 'object', fields: [defineField({ name: 'title', type: 'string', description: 'Two verbs, e.g. Explore & Build' }), defineField({ name: 'body', type: 'text', rows: 3 })] }),
            defineField({ name: 'upper', title: 'Upper School (9–12)', type: 'object', fields: [defineField({ name: 'title', type: 'string', description: 'Two verbs, e.g. Explore & Build' }), defineField({ name: 'body', type: 'text', rows: 3 })] }),
          ],
          preview: { select: { title: 'name', media: 'image' } },
        }),
      ],
    }),
    text('timeTitle', 'Time title', 1, 'body'),
    text('timeBody', 'Time text', 3, 'body'),
    text('rhythmTitle', 'Rhythm chart: label', 1, 'body'),
    defineField({
      name: 'rhythm',
      title: 'Rhythm chart: blocks (focused learning, then intersession)',
      type: 'array',
      group: 'body',
      validation: (r) => r.max(2),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'weeks', type: 'number', description: 'Sets the block width, e.g. 5' }),
            defineField({ name: 'label', type: 'string', description: 'e.g. Focused learning' }),
            defineField({ name: 'detailTitle', title: 'Detail heading', type: 'string', description: 'e.g. Longer class periods' }),
            defineField({ name: 'detailBody', title: 'Detail text', type: 'string' }),
          ],
          preview: { select: { title: 'label', weeks: 'weeks' }, prepare: ({ title, weeks }) => ({ title: `${weeks} weeks · ${title}` }) },
        }),
      ],
    }),
    text('rhythmCaption', 'Rhythm chart: caption', 2, 'body'),
    text('timeNote', 'Time note', 2, 'body'),
    { ...img('timeImage', 'Time image'), group: 'body' },
    text('thirdTitle', 'Third Way title', 1, 'body'),
    text('thirdBody', 'Third Way text', 4, 'body'),
    labelled('thirdItems', 'Third Way intersections', 'body'),
    text('curriculumTitle', 'Curriculum title', 1, 'body'),
    text('curriculumBody', 'Curriculum text', 4, 'body'),
    text('scaleBody', 'Scale line', 2, 'body'),
    text('galleryTitle', 'Gallery title', 1, 'body'),
    galleryField('body'),
  ],
  preview: { prepare: () => ({ title: 'The Learning Experience' }) },
})

export const campusPage = defineType({
  name: 'campusPage',
  title: 'The Campus',
  type: 'document',
  groups: [{ name: 'hero', title: 'Hero', default: true }, { name: 'body', title: 'Sections' }, { name: 'plan', title: 'Site plan' }],
  fields: [
    ...hero(),
    defineField({
      name: 'facts',
      type: 'array',
      group: 'body',
      of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'value', type: 'string' }), defineField({ name: 'label', type: 'string' })], preview: { select: { title: 'value', subtitle: 'label' } } })],
    }),
    text('regionTitle', 'South Florida title', 2, 'body'),
    paras('regionBody', 'South Florida text', 'body'),
    text('storyTitle', 'Story title', 1, 'body'),
    paras('storyBody', 'Story', 'body'),
    text('planTitle', 'Plan title', 1, 'plan'),
    text('planIntro', 'Plan intro', 2, 'plan'),
    { ...img('planImage', 'Illustrated site plan', 'Leave empty to use the current illustration. If you replace it, move the numbers to match.'), group: 'plan' },
    defineField({ name: 'planShift', title: 'Plan image: shift left (%)', type: 'number', group: 'plan', description: 'Moves the plan (with its markers) left so the campus edge lines up with the text. 9 suits the 2026 rendering; 0 = no shift.' }),
    text('streetLabel', 'Street name above the plan', 1, 'plan'),
    defineField({ name: 'streetX', title: 'Street arrow tip: across (%)', type: 'number', group: 'plan', description: 'Where the arrow lands on the street; the name sits above and to the left. Default 85.5' }),
    defineField({ name: 'streetY', title: 'Street arrow tip: down (%)', type: 'number', group: 'plan', description: 'Default 15.9' }),
    defineField({
      name: 'areas',
      title: 'Site plan markers',
      description: 'Letters are filled in automatically in list order (A, B, C…). Numbers show the number you enter; two markers can share one.',
      type: 'array',
      group: 'plan',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'kind',
              title: 'Marker',
              type: 'string',
              options: { list: [{ title: 'Letter (navy)', value: 'letter' }, { title: 'Number (light blue)', value: 'number' }], layout: 'radio', direction: 'horizontal' },
            }),
            defineField({ name: 'n', title: 'Number', type: 'number', description: 'Only used when Marker is Number.', hidden: ({ parent }: any) => parent?.kind === 'letter' }),
            defineField({ name: 'label', type: 'string' }),
            defineField({ name: 'x', title: 'Across (%)', type: 'number', description: '0 = left edge, 100 = right edge' }),
            defineField({ name: 'y', title: 'Down (%)', type: 'number', description: '0 = top, 100 = bottom' }),
            defineField({ name: 'note', type: 'text', rows: 2, description: 'Optional short description' }),
          ],
          preview: { select: { n: 'n', kind: 'kind', title: 'label' }, prepare: ({ n, kind, title }) => ({ title: title || 'New marker', subtitle: kind === 'number' ? `Number ${n ?? ''}` : 'Letter' }) },
        }),
      ],
    }),
    text('galleryTitle', 'Gallery title', 1, 'body'),
    galleryField('body'),
    text('closing', 'Closing line', 3, 'body'),
  ],
  preview: { prepare: () => ({ title: 'The Campus' }) },
})

export const teamPage = defineType({
  name: 'teamPage',
  title: 'The Visionaries',
  type: 'document',
  groups: [{ name: 'hero', title: 'Hero', default: true }, { name: 'body', title: 'Sections' }],
  fields: [
    ...hero(),
    paras('body', 'Introduction', 'body'),
    defineField({ name: 'showLeadership', title: 'Show Founding Leadership', type: 'boolean', group: 'body', initialValue: false, description: 'Off: only the Advancement team (and their profiles) appear on the site.' }),
    text('leadershipTitle', 'Leadership heading', 1, 'body'),
    text('leadershipIntro', 'Leadership intro', 2, 'body'),
    defineField({ name: 'showAdvancement', title: 'Show Wingrove Academy Advancement Team', type: 'boolean', group: 'body', initialValue: true, description: 'Off: the Advancement team is hidden on this page. It still appears on the A Founding Opportunity donor page, and their profiles stay available.' }),
    text('advancementTitle', 'Advancement heading', 1, 'body'),
    text('advancementIntro', 'Advancement intro', 2, 'body'),
    text('givingEyebrow', 'Closing band: eyebrow', 1, 'body'),
    text('givingTitle', 'Closing band: title', 2, 'body'),
    paras('givingBody', 'Closing band: text', 'body'),
    text('givingButton', 'Closing band: button', 1, 'body'),
    text('givingHref', 'Closing band: button link', 1, 'body'),
  ],
  preview: { prepare: () => ({ title: 'The Visionaries' }) },
})

export const whyPage = defineType({
  name: 'whyPage',
  title: 'Why Wingrove',
  type: 'document',
  description: 'The Why Wingrove page. The ten distinctions themselves are edited on the Home page (What Makes Wingrove Distinctive), so the carousel and this page always match.',
  groups: [{ name: 'hero', title: 'Hero', default: true }],
  fields: [
    ...hero(),
    defineField({ name: 'indexTitle', title: 'Index heading', type: 'string', group: 'hero', description: 'Above the numbered list of distinctions. Default: At a glance' }),
  ],
  preview: { prepare: () => ({ title: 'Why Wingrove' }) },
})

export const givingPage = defineType({
  name: 'givingPage',
  title: 'A Founding Opportunity',
  type: 'document',
  description: 'Donor page at /founding-opportunity. Not in the navigation; linked from the Advancement band on The Visionaries.',
  groups: [{ name: 'hero', title: 'Hero', default: true }, { name: 'body', title: 'Sections' }],
  fields: [
    ...hero(),
    paras('intro', 'Introduction', 'body'),
    defineField({
      name: 'quotes',
      title: 'Parent quotes (up to 3; more than one rotates)',
      type: 'array',
      group: 'body',
      validation: (r) => r.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'quote', type: 'text', rows: 4, description: 'Without quotation marks; they are added.' }),
            defineField({ name: 'attribution', type: 'string', description: 'e.g. Prospective Parent' }),
          ],
          preview: { select: { title: 'quote', subtitle: 'attribution' } },
        }),
      ],
    }),
    { ...img('quotesImage', 'Parent quotes: background', 'Leave empty for the palm leaf.'), group: 'body' },
    text('supportTitle', 'Support: heading', 1, 'body'),
    { ...img('supportImage', 'Support: image'), group: 'body' },
    labelled('supportItems', 'Support: items', 'body'),
    text('statsTitle', 'Figures: heading', 1, 'body'),
    { ...img('statsImage', 'Figures: background image', 'Shown under a blue tint.'), group: 'body' },
    defineField({
      name: 'stats',
      title: 'Figures',
      type: 'array',
      group: 'body',
      of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'value', type: 'string', description: 'e.g. $50.6 Million' }), defineField({ name: 'label', type: 'string' }), defineField({ name: 'countUp', title: 'Count up when scrolled into view', type: 'boolean', initialValue: false })], preview: { select: { title: 'value', subtitle: 'label' } } })],
    }),
    text('giftEyebrow', 'Gift: eyebrow', 1, 'body'),
    text('giftTitle', 'Gift: heading', 1, 'body'),
    text('giftSubtitle', 'Gift: subheading', 2, 'body'),
    text('giftBody', 'Gift: text', 3, 'body'),
    strings('giftPerks', 'Gift: list', 'body'),
    text('formButton', 'Form button', 1, 'body'),
    text('otherBody', 'Gift: last list item', 3, 'body'),
  ],
  preview: { prepare: () => ({ title: 'A Founding Opportunity' }) },
})

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  description: 'Simple text pages such as the Privacy Policy, shown at /<slug>.',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'intro', type: 'text', rows: 2 }),
    defineField({ name: 'lastUpdated', title: 'Last updated (as shown)', type: 'string', description: 'e.g. August 2025. Leave empty to hide.' }),
    defineField({ name: 'body', type: 'array', of: [defineArrayMember({ type: 'block' })] }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
})

export const schemaTypes = [siteSettings, homePage, learningPage, campusPage, teamPage, whyPage, givingPage, person, page]
export const singletonTypes = new Set(['siteSettings', 'homePage', 'learningPage', 'campusPage', 'teamPage', 'whyPage', 'givingPage'])
