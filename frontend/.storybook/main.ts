import type { StorybookConfig } from '@storybook/nextjs';
import type { Configuration, RuleSetRule } from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    // In Storybook 10 the "essentials" (controls, actions, viewport, etc.) and
    // interactions are bundled into core and are no longer separate addons.
    '@storybook/addon-onboarding',
    '@storybook/addon-docs',
    '@chromatic-com/storybook',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config: Configuration) => {
    const imageRule = config.module?.rules?.find((rule) => {
      const test = (rule as { test: RegExp }).test;

      if (!test) {
        return false;
      }

      return test.test('.svg');
    }) as RuleSetRule | undefined;

    if (imageRule) {
      imageRule.exclude = /\.svg$/;
    }

    config.module?.rules?.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
export default config;
