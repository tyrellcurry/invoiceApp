import createNextIntlPlugin from 'next-intl/plugin';
import { NextConfig } from 'next';
import { Configuration } from 'webpack';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  webpack(config: Configuration) {
    config.module?.rules?.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

module.exports = withNextIntl(nextConfig);
