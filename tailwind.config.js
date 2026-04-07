/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5F7FF',
          100: '#EBEEFE',
          200: '#DDE2FD',
          300: '#C2CBFB',
          400: '#9BA9F9',
          500: '#6366F1', // Indigo primary
          600: '#4F46E5', // Slightly darker indigo
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B', // Deepest indigo for "Night Slate"
        },
        accent: {
          50: '#F0FDF9',
          100: '#CCFBEE',
          200: '#99F6E0',
          300: '#5EEAD0',
          400: '#2DD4BF', // Teal/Emerald
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        luxury: {
          gold: '#D4AF37',
          silver: '#C0C0C0',
          glass: 'rgba(255, 255, 255, 0.05)',
        }
      },
      fontFamily: {
        display: ['"Outfit"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(40px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideIn: { '0%': { opacity: 0, transform: 'translateX(-20px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
      },
    },
  },
  plugins: [],
}
