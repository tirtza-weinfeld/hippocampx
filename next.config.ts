import type { NextConfig } from "next";
import createMDX from '@next/mdx'


const nextConfig: NextConfig = {

  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],


  experimental: {
    ppr: true,
    mdxRs: true,

  },
};

const withMDX = createMDX({
  options: { },
});

export default withMDX(nextConfig);