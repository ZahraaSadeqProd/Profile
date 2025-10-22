/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
  extend: {
    colors: {
      accent: {
        pink: '#E9C3DC',
        coral: '#f67f77', // slightly deeper for light background contrast
        peach: '#FBBB8C',
        gold: '#FCE18F',
      },
        bgLight: '#ffffff',
        bgDark: '#0F172A',
        textLight: '#111827',
        textDark: '#F1F5F9',
      },
      backgroundImage: {
        'accent-gradient':
          'linear-gradient(135deg, #E9C3DC 0%, #F6B8AF 35%, #FBBB8C 67%, #FCE18F 95%)',
      },
    },
  },
  plugins: [],
};