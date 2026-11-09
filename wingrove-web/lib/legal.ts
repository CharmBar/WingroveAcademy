import { client } from './sanity'

export type SimplePage = { title: string; eyebrow?: string; intro?: string; body?: any[]; updated?: string }

/** Simple pages edited in Studio → Pages (e.g. Privacy Policy), served at /<slug>. */
export async function getSimplePage(slug: string): Promise<SimplePage | null> {
  if (!client) return null
  try {
    return await client.fetch(`*[_type == "page" && slug.current == $slug][0]{title, eyebrow, intro, body, "updated": _updatedAt}`, { slug }, { next: { revalidate: 60 } })
  } catch (e) {
    console.error('Sanity fetch failed', slug, e)
    return null
  }
}

export async function getSimpleSlugs(): Promise<string[]> {
  if (!client) return []
  try {
    return await client.fetch(`*[_type == "page" && defined(slug.current)].slug.current`)
  } catch {
    return []
  }
}
