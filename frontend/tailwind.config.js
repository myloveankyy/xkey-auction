const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        'league-spartan': ['"League Spartan"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'brand-light-gray': '#f5f5f5',
        // --- ADDED: Gradient colors for our new design ---
        'gradient-start': '#3b82f6', // A nice Blue-500
        'gradient-end': '#8b5cf6',   // A vibrant Violet-500
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}