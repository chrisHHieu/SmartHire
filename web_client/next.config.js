/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["https://lh3.googleusercontent.com", "*"],
    // Disable image optimization to avoid sharp dependency issues in Docker
    unoptimized: true,
  },
  // experimental: {
  //   appDir: true,
  // },
  reactStrictMode: true,

  // Output configuration for Docker
  output: 'standalone',
};

module.exports = nextConfig;
