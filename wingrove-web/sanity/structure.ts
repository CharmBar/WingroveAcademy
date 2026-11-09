import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Wingrove Academy')
    .items([
      S.listItem().title('Home page').id('homePage').child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem().title('The Learning Experience').id('learningPage').child(S.document().schemaType('learningPage').documentId('learningPage')),
      S.listItem().title('The Campus').id('campusPage').child(S.document().schemaType('campusPage').documentId('campusPage')),
      S.listItem().title('The Visionaries').id('teamPage').child(S.document().schemaType('teamPage').documentId('teamPage')),
      S.listItem().title('A Founding Opportunity (donors, hidden)').id('givingPage').child(S.document().schemaType('givingPage').documentId('givingPage')),
      S.listItem().title('Site settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('person').title('Team members'),
      S.documentTypeListItem('page').title('Pages'),
    ])
