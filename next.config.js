/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Force fresh builds by generating a unique build ID
  generateBuildId: async () => {
    // Use timestamp to ensure each build is unique
    return `build-${Date.now()}`;
  },
  async redirects() {
    return [
      // Redirect www to non-www (HTTPS)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.deepbreathingexercises.com',
          },
        ],
        destination: 'https://deepbreathingexercises.com/:path*',
        permanent: true, // 301 redirect
      },
      // Redirect HTTP to HTTPS (non-www)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'deepbreathingexercises.com',
          },
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://deepbreathingexercises.com/:path*',
        permanent: true, // 301 redirect
      },
    ];
  },
};

module.exports = nextConfig;