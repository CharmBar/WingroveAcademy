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
    defineField({ name: 'credit', title: 'Rendering credit', type: 'string' }),
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
          fields: [defineField({ name: 'label', type: 'string' }), defineField({ name: 'body', type: 'text', rows: 3 })],
          preview: { select: { title: 'label', subtitle: 'body' } },
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
    of: [defineArrayMember({ type: 'object', fields: [img('image', 'Image'), defineField({ name: 'caption', type: 'string' })], preview: { select: { title: 'caption', media: 'image' } } })],
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
    text('divisionsBody', 'Schools text', 3, 'body'),
    strings('divisions', 'Schools, in order', 'body'),
    text('divisionsFrom', 'Starts with', 1, 'body'),
    text('divisionsTo', 'Grows toward', 1, 'body'),
    text('timeTitle', 'Time title', 1, 'body'),
    text('timeBody', 'Time text', 3, 'body'),
    strings('timeItems', 'Time features', 'body'),
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
    text('storyTitle', 'Story title', 1, 'body'),
    paras('storyBody', 'Story', 'body'),
    text('planTitle', 'Plan title', 1, 'plan'),
    text('planIntro', 'Plan intro', 2, 'plan'),
    { ...img('planImage', 'Illustrated site plan', 'Leave empty to use the current illustration. If you replace it, move the numbers to match.'), group: 'plan' },
    defineField({
      name: 'areas',
      title: 'Numbered areas',
      type: 'array',
      group: 'plan',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'n', title: 'Number', type: 'number' }),
            defineField({ name: 'label', type: 'string' }),
            defineField({ name: 'x', title: 'Across (%)', type: 'number', description: '0 = left edge, 100 = right edge' }),
            defineField({ name: 'y', title: 'Down (%)', type: 'number', description: '0 = top, 100 = bottom' }),
            defineField({ name: 'note', type: 'text', rows: 2, description: 'Optional short description' }),
          ],
          preview: { select: { n: 'n', title: 'label' }, prepare: ({ n, title }) => ({ title: `${n}. ${title}` }) },
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
    text('leadershipTitle', 'Leadership heading', 1, 'body'),
    text('leadershipIntro', 'Leadership intro', 2, 'body'),
    text('advancementTitle', 'Advancement heading', 1, 'body'),
    text('advancementIntro', 'Advancement intro', 2, 'body'),
  ],
  preview: { prepare: () => ({ title: 'The Visionaries' }) },
})

export const schemaTypes = [siteSettings, homePage, learningPage, campusPage, teamPage, person]
export const singletonTypes = new Set(['siteSettings', 'homePage', 'learningPage', 'campusPage', 'teamPage'])
