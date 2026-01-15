/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand colors - warm coral/rose palette
        primary: {
          50: '#FFF5F3',
          100: '#FFE8E4',
          200: '#FFCFC7',
          300: '#FFB0A3',
          400: '#F6897C',
          500: '#E86F5D',   // Main brand color
          600: '#D45544',
          700: '#B04435',
          800: '#8F372B',
          900: '#742F26',
        },
        // Secondary accent - warm gold/amber
        secondary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
        },
        // Tertiary accent - soft blush/rose
        tertiary: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
        },
        // Neutral surfaces
        surface: {
          light: '#FAFAFA',
          dark: '#0F172A',
          'dark-elevated': '#1E293B',
        },
        // Status colors harmonized with brand
        success: {
          light: '#ECFDF5',
          DEFAULT: '#059669',
          dark: '#064E3B',
        },
        // Legacy support (kept for compatibility)
        accent: {
          coral: '#E86F5D',
          peach: '#FFB0A3',
          gold: '#FDE68A',
          pink: '#F9A8D4',
        },
        bgDark: '#0F172A',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #F9A8D4 0%, #F6897C 40%, #FFB0A3 70%, #FDE68A 100%)',
        'accent-gradient-subtle': 'linear-gradient(135deg, #FDF2F8 0%, #FFF5F3 50%, #FFFBEB 100%)',
        'accent-gradient-dark': 'linear-gradient(135deg, #EC4899 0%, #E86F5D 50%, #F59E0B 100%)',
      },
    },
  },
  plugins: [],
};