/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'g2-orange': '#FF492C',
        'g2-dark': '#1A1A1A',
        'g2-light': '#F8F7F4',
      },
    },
  },
  plugins: [],
}
