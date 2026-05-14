/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#060b12',
      },
      boxShadow: {
        glow: '0 0 40px rgba(45, 212, 191, 0.38)',
      },
    },
  },
  plugins: [],
}

