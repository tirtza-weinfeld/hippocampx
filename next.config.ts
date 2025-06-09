import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  pageExtensions: [ 'mdx', 'ts', 'tsx'],


  experimental: {
    ppr: true,

  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/random/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig;