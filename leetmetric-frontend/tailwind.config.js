/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        easy: '#00b8a3',
        medium: '#ffc01e',
        hard: '#ff375f',
      }
    },
  },
  plugins: [],
}
