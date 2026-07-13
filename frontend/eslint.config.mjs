import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import unusedImports from 'eslint-plugin-unused-imports';
import storybook from 'eslint-plugin-storybook';

const eslintConfig = [
  {
    ignores: ['.next/**', 'storybook-static/**', 'coverage/**', 'node_modules/**'],
  },
  // Next.js 16 ships native flat configs, so we consume them directly instead
  // of bridging the legacy shareable configs through FlatCompat. These already
  // register the `react`, `react-hooks`, `@next/next` and `@typescript-eslint`
  // plugins, so we must not redefine them below.
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...storybook.configs['flat/recommended'],
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],

      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          shorthandFirst: false,
          shorthandLast: true,
          multiline: 'last',
          ignoreCase: true,
          noSortAlphabetically: false,
        },
      ],

      'react/sort-prop-types': [
        'error',
        {
          callbacksLast: true,
          ignoreCase: true,
          requiredFirst: false,
          sortShapeProp: true,
        },
      ],
    },
  },
];

export default eslintConfig;
