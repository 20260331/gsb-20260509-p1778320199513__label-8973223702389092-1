/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable standalone output for Docker deployment
  output: 'standalone',
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // typedRoutes disabled due to dynamic href compatibility
  // experimental: {
  //   typedRoutes: true,
  // },
}

module.exports = nextConfig
