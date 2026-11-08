export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-10-01'

/** True once a Sanity project ID is configured; until then the site renders built-in seed content. */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId)
