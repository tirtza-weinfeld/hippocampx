import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      'remark-math',
      'remark-gfm',
      '@hippocampx/plugins/remark-typography',

      '@hippocampx/plugins/remark-section-list',
      '@hippocampx/plugins/remark-github-alerts',
      '@hippocampx/plugins/remark-code-copy',
      '@hippocampx/plugins/remark-feature-list',
      '@hippocampx/plugins/remark-list-variants',
      '@hippocampx/plugins/toc-plugin',

      '@hippocampx/plugins/remark-section-wrapper',


      ],
    rehypePlugins: [
      'rehype-katex',
      ['rehype-mdx-code-props', { tagName: 'code' }],
      'rehype-slug',
      ['rehype-autolink-headings',
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
  // turbopack: {
  //   rules: {
  //     '*.mdx': {
  //       loaders: ['@hippocampx/plugins/mdx-latex-loader'],
  //       as: '*.mdx',
  //     },
  //   },
  // },
  typedRoutes: true,
  reactCompiler: true,

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
    // qualities: [75, 100],
  },
}

export default withMDX(nextConfig)
