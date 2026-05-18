/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Elevate brand colors (keeping same class names, just updating values)
        'g2-orange': '#FF492C',  // Elevate rorange-100 (brand)
        'g2-dark': '#201f23',    // Elevate neutral-100
        'g2-light': '#fafafa',   // Elevate neutral-5
      },
      fontFamily: {
        'sans': ['Figtree', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
