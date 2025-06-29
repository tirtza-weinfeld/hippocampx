/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {
      // Disable caching in development for better hot reloading
      cache: process.env.NODE_ENV === 'production',
    },
  },
};

export default config;