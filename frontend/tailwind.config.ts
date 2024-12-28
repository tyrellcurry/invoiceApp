import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-leaguespartan)'],
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      blue: {
        100: '#DFE3FA', // Light Blue
        200: '#7E88C3', // Muted Blue
        300: '#7C5DFA', // Soft Purple-Blue
      },
      gray: {
        100: '#F8F8FB', // Very Light Gray
        200: '#DFE3FA', // Light Gray
        300: '#888EB0', // Medium Gray
        400: '#1E2139', // Dark Gray-Blue
        500: '#252945', // Very Dark Gray-Blue
        600: '#141625', // Very Dark Gray-Black
        700: '#0C0E16', // Blackish Gray
      },
      red: {
        400: '#9277FF', // Soft Light Ref
        500: '#EC5757', // Red
      },
    },
  },
  plugins: [],
} satisfies Config;
