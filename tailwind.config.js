/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Tajawal', 'IBM Plex Sans Arabic', 'sans-serif'],
        latin: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
