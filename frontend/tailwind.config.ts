import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './stories/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-leaguespartan)'],
      },
      screens: {
        xs: '414px',
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      neutral: {
        '11': '#F8F8FB', // Off White
      },
      blue: {
        '01': '#7C5DFA', // Soft Purple-Blue
        '02': '#9277FF', // Soft Light Purple-Blue
        '03': '#1E2139', // Dark Gray-Blue
        '04': '#252945', // Very Dark Gray-Blue
      },
      gray: {
        100: '#F8F8FB', // Very Light Gray
        '04': '#494E6E', // Soft Light Gray Blue
        '05': '#DFE3FA', // Light Gray Blue
        '05b': '#F9FAFE', // Light Gray Btn
        '06': '#888EB0', // Medium Gray
        '07': '#7E88C3', // Muted Blue
        '08': '#0C0E16', // Blackish Gray
        '09': '#373B53', // Blackish Blue-Light
        400: '#1E2139', // Dark Gray-Blue
        '12': '#141625', // Very Dark Gray-Black
      },
      red: {
        '08': '#EC5757', // Red
        '10': '#FF9797', // Soft Light Red
      },
    },
  },
  plugins: [],
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
} satisfies Config;
