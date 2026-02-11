/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Content redirects
      {
        source: '/how-to-lower-blood-pressure-with-fourfold-deep-breathing/:path*',
        destination: '/for/high-blood-pressure',
        permanent: true,
      },
      {
        source: '/cleansing-breath-exercise/:path*',
        destination: '/breathe',
        permanent: true,
      },
      {
        source: '/youre-doing-just-fine/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/page/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/the-dos-and-donts-of-paper-bag-breathing/:path*',
        destination: '/for/panic-attacks',
        permanent: true,
      },
      {
        source: '/breathing-exercises-that-help-with-asthma/:path*',
        destination: '/breathe',
        permanent: true,
      },
      {
        source: '/app',
        destination: '/breathing-app',
        permanent: true,
      },
      {
        source: '/app/',
        destination: '/breathing-app',
        permanent: true,
      },
      {
        source: '/app/:path*',
        destination: '/breathing-app',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
