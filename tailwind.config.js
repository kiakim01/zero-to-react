/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'watcha-red': '#FF0558',
        'watcha-dark': '#141414',
        'watcha-gray': '#2a2a2a',
      }
    },
  },
  plugins: [],
}