import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],

    // Transformation budget, not a style choice. This project is on Vercel's
    // Hobby plan, which includes 5,000 image transformations a month; past that
    // new images return 402 and render their alt text instead. Every distinct
    // (width x format) pair counts as one transformation, so the defaults —
    // eight device widths across AVIF and WebP — would put ~650 article images
    // over the cap immediately.
    //
    // Three widths and WebP only keeps the worst case near 1,950. AVIF is
    // roughly 20% smaller than WebP but doubles the count for that gain, which
    // is not a trade worth making against a hard ceiling.
    deviceSizes: [640, 1080, 1920],
    imageSizes: [96, 256],
    formats: ['image/webp'],

    // Cache aggressively: a transformation is only billed on a miss, and these
    // assets are immutable — a new image gets a new Cloudinary public_id.
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
};

export default nextConfig;
