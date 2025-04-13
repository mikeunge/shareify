import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://mosaic.scdn.co/**')]
  }
};

export default nextConfig;
