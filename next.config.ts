import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
    cacheComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default nextConfig
