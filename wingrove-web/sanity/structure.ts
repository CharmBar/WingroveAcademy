import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Wingrove Academy')
    .items([
      S.listItem().title('Home page').id('homePage').child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem().title('Site settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('person').title('Team members'),
    ])
