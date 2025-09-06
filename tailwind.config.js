/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf8ff',
          100: '#d7efff',
          200: '#b2e2ff',
          300: '#7cd1ff',
          400: '#3bbaff',
          500: '#0da2ff',
          600: '#0088e6',
          700: '#006bb4',
          800: '#045086',
          900: '#063e66',
        },
        accent: {
          500: '#ff8212',
        },
        tile: {
          500: '#f8e6a0',
        },
        teal: {
          500: '#2cb1a6',
        },
        neutral: {
          bg: '#ffffff',
          'bg-muted': '#f9fafb',
          text: '#111827',
          'text-muted': '#4b5563',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
        '3xl': '48px',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(17,24,39,0.06)',
        md: '0 6px 20px rgba(17,24,39,0.08)',
        lg: '0 12px 32px rgba(17,24,39,0.12)',
      },
    },
  },
  plugins: [],
}