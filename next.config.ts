import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import rehypeTooltipWords from '@/plugins/content-popover-plugin'
import { POPOVER_CONTENT } from "./components/mdx/code/popover-content"

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkMath, remarkToc, remarkGfm],
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

      [rehypeTooltipWords, {
        ...POPOVER_CONTENT
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
