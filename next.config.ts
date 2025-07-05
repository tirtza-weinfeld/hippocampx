import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import remarkInjectToc from "@/plugins/toc-plugin"
import { remarkGithubAlerts } from "@/plugins/remark-github-alerts"
import remarkSmartCodeImport from "@/plugins/remark-smart-code-import"
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      remarkSmartCodeImport, 
      remarkMath, 
      remarkGfm,
      remarkInjectToc,
      remarkGithubAlerts,
      ],
    rehypePlugins: [
      rehypeKatex,
      [rehypeMdxCodeProps, { tagName: 'code' }],
      rehypeSlug,
      [rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['anchor'],
          },
        }],
    ],
  },
})

const nextConfig: NextConfig = {
  experimental: {
    // ppr: true,
    mdxRs: false,
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // Force CSS updates during development
  // webpack: (config, { dev, isServer }) => {
  //   if (dev && !isServer) {
  //     // Disable CSS caching in development
  //     config.cache = false;
  //   }
  //   return config;
  // },
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

export default withMDX(nextConfig)
