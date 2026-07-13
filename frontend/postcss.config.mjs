/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Tailwind v4's PostCSS plugin handles @import bundling, nesting and
    // vendor prefixing internally, so postcss-import / nesting / autoprefixer
    // are no longer needed.
    '@tailwindcss/postcss': {},
  },
};

export default config;
