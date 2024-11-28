/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-100': '#141414',
        'dark-90': '#1A1A1A',
        'dark-80': '#262626',
        'dark-50': '#4D4D4D',
        'dark-10': '#999999',
        'btn-primary': '#703BF7',
        'btn-secondary': '#8254F8',
        'btn-accent': '#DBCEFD',
      },
      keyframes: {
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        'spin-slow': 'spin-slow 20s linear infinite'
      }
    },
  },
  plugins: [],
}
