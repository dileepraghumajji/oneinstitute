/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enables per-export tree-shaking for these packages — avoids pulling the
    // full barrel when only a few icons / utilities are used.
    optimizePackageImports: ['lucide-react', 'gsap', '@react-three/drei', 'lenis'],
  },

  async headers() {
    return [
      {
        // Next.js content-hashes every static asset filename — safe to cache forever.
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig
