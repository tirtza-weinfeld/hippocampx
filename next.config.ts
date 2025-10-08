import type { NextConfig } from "next";
import createMDX from '@next/mdx'

// import remarkMath from 'remark-math'
// import rehypeKatex from 'rehype-katex'
// import rehypeMdxCodeProps from 'rehype-mdx-code-props'
// import rehypeSlug from 'rehype-slug'
// import rehypeAutolinkHeadings from 'rehype-autolink-headings'
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      'remark-math',
      'remark-gfm',
      '@hippocampx/plugins/remark-typography',
      '@hippocampx/plugins/remark-code-tabs',
      '@hippocampx/plugins/remark-header-section',
      '@hippocampx/plugins/remark-section-list',
      '@hippocampx/plugins/toc-plugin',
      '@hippocampx/plugins/remark-github-alerts',
      '@hippocampx/plugins/remark-code-copy',
      '@hippocampx/plugins/remark-feature-list',
      '@hippocampx/plugins/remark-list-variants',


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
  typedRoutes: true,
  reactCompiler: true,
  // experimental: {
  //   // ppr: true,
  //   mdxRs: false,
  // },
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
    // qualities: [75, 100],
  },
}

export default withMDX(nextConfig)
