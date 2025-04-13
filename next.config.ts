import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://mosaic.scdn.co/**'),
      new URL('https://image-cdn-ak.spotifycdn.com/**')
    ]
  }
};

export default nextConfig;
