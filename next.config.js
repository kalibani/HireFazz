const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'googleusercontent.com',
      'oaidalleapiprodscus.blob.core.windows.net',
      'cdn.openai.com',
      'lh3.googleusercontent.com',
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    }
  }
};

module.exports = withNextIntl(nextConfig);