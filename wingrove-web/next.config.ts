import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }] },
  // The embedded Sanity Studio lives at /studio and handles its own sub-routes
  async rewrites() {
    return [{ source: '/studio/:path*', destination: '/studio' }]
  },
}

export default nextConfig
