import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const eslintConfig = [
  {
    ignores: [
      'dist/**',
      '.next/**',
      '.swc/**',
      'storybook-static/**',
      'coverage/**',
      'node_modules/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,jsx,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

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

      // Sort the named members within a single import ({ b, a } -> { a, b }).
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],

      // Order the import statements themselves: external, then @/ internal,
      // then relative — alphabetised within each group. Auto-fixable.
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'ignore',
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
  ...storybook.configs['flat/recommended'],
  // Bulletproof-react unidirectional architecture: shared -> features -> app.
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // Features cannot import from other features.
            {
              target: './src/features/invoices',
              from: './src/features',
              except: ['./invoices'],
            },
            // Features cannot reach up into the app layer.
            {
              target: './src/features',
              from: './src/app',
            },
            // Shared modules cannot import from features or the app layer.
            {
              target: ['./src/components', './src/hooks', './src/lib', './src/stores', './src/config'],
              from: ['./src/features', './src/app'],
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
