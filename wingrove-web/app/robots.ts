import type { MetadataRoute } from 'next'
import { gateEnabled } from '@/lib/gate'

/** While the preview gate is on, ask search engines to stay out entirely. */
export default function robots(): MetadataRoute.Robots {
  if (gateEnabled()) return { rules: [{ userAgent: '*', disallow: '/' }] }
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://wingroveacademy.ai'
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/studio', '/api'] }], sitemap: `${base}/sitemap.xml` }
}
