import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  webpack: (config) => {
    return config;
  },
  async redirects() {
    return [
      {
        source: '/blog/knowledge-base-chatbot-guide',
        destination: '/guides/knowledge-base-chatbot',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Allow embedding for /embed routes
        source: '/embed/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors *',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
