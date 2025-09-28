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
// import remarkSmartCodeImport from "@/plugins/remark-smart-code-import"
import remarkCodeCopy from "@/plugins/remark-code-copy"
import remarkFeatureList from "@/plugins/remark-feature-list"
import remarkListVariants from "@/plugins/remark-list-variants"
import { remarkHeaderSection } from "@/plugins/remark-header-section"
import { remarkTypography } from "@/plugins/remark-typography"
import { remarkSectionList } from "@/plugins/remark-section-list"

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      remarkMath, 
      remarkGfm,
      remarkTypography,


      remarkHeaderSection,
      remarkSectionList,

      remarkInjectToc,

      remarkGithubAlerts,
      remarkCodeCopy,
      // remarkSmartCodeImport,

      remarkFeatureList,    // Must run before remarkListVariants
      remarkListVariants, 
   

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
    reactCompiler: true,
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
