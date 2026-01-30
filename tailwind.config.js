/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand colors - warm rose/pink palette (aligned with new logo)
        primary: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',   // Main brand color (Pink-500)
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
        },
        // Secondary accent - warm rose/red/orange
        secondary: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',   // Rose-500
          600: '#E11D48',
          700: '#BE123C',
        },
        // Tertiary accent - warm amber/gold
        tertiary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',   // Amber-500
          600: '#D97706',
          700: '#B45309',
        },
        // Neutral surfaces (unified dark mode palette)
        surface: {
          light: '#FAFAFA',
          dark: '#0A0A0E',
          'dark-elevated': '#141219',
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
        'accent-gradient': 'linear-gradient(135deg, #EC4893 0%, #F43F5E 40%, #FB923C 70%, #FBBF24 100%)',
        'accent-gradient-subtle': 'linear-gradient(135deg, #FDF2F8 0%, #FFF1F2 50%, #FFFBEB 100%)',
        'accent-gradient-dark': 'linear-gradient(135deg, #BE185D 0%, #BE123C 50%, #B45309 100%)',
      },
    },
  },
  plugins: [],
};