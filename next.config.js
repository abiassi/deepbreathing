/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Force fresh builds by generating a unique build ID
  generateBuildId: async () => {
    // Use timestamp to ensure each build is unique
    return `build-${Date.now()}`;
  }
};

module.exports = nextConfig;