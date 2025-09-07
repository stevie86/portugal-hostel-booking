const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  allowedDevOrigins: ['localhost', '127.0.0.1', '.github.dev', '.githubpreview.dev'],
}

module.exports = withNextIntl(nextConfig)