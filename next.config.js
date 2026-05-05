/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Allow embedding only for /embed/* routes
        source: '/embed/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'ALLOWALL' },
          { key: 'Content-Security-Policy', value: "frame-ancestors *" },
        ],
      },
    ];
  },
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
      // Strip mass-translate-injected outer locale on cross-locale links
      // (e.g. /de/es/breathe/wim-hof → /es/breathe/wim-hof). Keeps user-intended
      // inner locale; eliminates 404s flagged in GSC for stale doubly-prefixed URLs.
      {
        source: '/:outer(es|pt|fr|de|ja)/:inner(es|pt|fr|de|ja)/:rest*',
        destination: '/:inner/:rest*',
        permanent: true,
      },
      // Single-page routes with no nested children — collapse stray sub-paths to root.
      {
        source: '/breathing-app/:path+',
        destination: '/breathing-app',
        permanent: true,
      },
      {
        source: '/4-7-8-breathing-timer/:path+',
        destination: '/4-7-8-breathing-timer',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
