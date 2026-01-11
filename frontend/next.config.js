/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Force Webpack bundler for Stackblitz/WASM compatibility
  // Turbopack is disabled via --webpack flag in package.json scripts
};

module.exports = nextConfig;
