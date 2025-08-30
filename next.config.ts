import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Disable server-side features for static export
  experimental: {
    appDir: true,
  },
  // Ensure proper base path for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/packalator' : '',
};

export default nextConfig;
