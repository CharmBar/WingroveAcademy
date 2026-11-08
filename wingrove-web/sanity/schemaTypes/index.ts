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
    defineField({ name: 'shortBio', type: 'text', rows: 4 }),
    access,
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
})

export const schemaTypes = [siteSettings, homePage, person]
export const singletonTypes = new Set(['siteSettings', 'homePage'])
