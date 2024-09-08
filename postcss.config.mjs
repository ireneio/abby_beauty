/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    'postcss-preset-env': {
      stage: 0, // Enable all modern CSS features
      autoprefixer: {
        grid: true, // Ensure grid layout is compatible
        overrideBrowserslist: [
          'last 2 versions', // Support last two versions of all browsers
          'iOS >= 10',       // Support iOS 10 and above
          'Safari >= 10',    // Support Safari 10 and above
          'Chrome >= 60',    // Support Chrome 60 and above
          'Android >= 5'     // Support Android 5 and above
        ],
      },
    },
    cssnano: process.env.NODE_ENV === 'production' ? {} : false, // Minify CSS in production
  },
};

export default config;
