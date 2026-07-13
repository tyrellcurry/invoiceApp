import createNextIntlPlugin from 'next-intl/plugin';
import { NextConfig } from 'next';
import { Configuration } from 'webpack';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

const nextConfig: NextConfig = {
  // Turbopack is the default bundler in Next.js 16 (dev + build).
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Retained for any tooling that still falls back to webpack (e.g. Storybook).
  webpack(config: Configuration) {
    config.module?.rules?.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default withNextIntl(nextConfig);
