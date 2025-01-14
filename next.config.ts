import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {

  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  devIndicators: {
    buildActivity: false,
  },
  experimental: {
    // ppr: true,
    mdxRs: true,

  },
};


const withMDX = createMDX({

})

export default withMDX(nextConfig);