import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'
import { apiVersion, dataset, isSanityConfigured, projectId } from '@/sanity/env'

export const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' })
  : null

const builder = isSanityConfigured ? createImageUrlBuilder({ projectId, dataset }) : null

export type SanityImage = { asset?: { _ref?: string }; alt?: string } | null | undefined

/** Returns an image URL, or null when there is no uploaded image (a placeholder is drawn instead). */
export function imageUrl(img: SanityImage, width = 1600, height?: number): string | null {
  if (!builder || !img?.asset?._ref) return null
  let b = builder.image(img).width(width).auto('format').quality(80)
  if (height) b = b.height(height).fit('crop')
  return b.url()
}
