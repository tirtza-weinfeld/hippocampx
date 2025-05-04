import type { NextConfig } from "next";
import createMDX from '@next/mdx'


const nextConfig: NextConfig = {

  pageExtensions: ['md', 'mdx', 'ts', 'tsx'],


  experimental: {
    ppr: true,
    mdxRs: true,

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

const withMDX = createMDX({});

export default withMDX(nextConfig);