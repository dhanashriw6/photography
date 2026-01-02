/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#F08E2E',
        'brand-red': '#B8392D',
        'brand-teal': '#2C7A8A',
        'brand-cream': '#F7F3E8',
        'brand-lightblue': '#A6E1EB',
        'brand-black': '#1A1A1A',
        // Mapping to existing CSS variable semantics for direct utility usage
        'mocha': '#1A1A1A',
        'beige': '#F7F3E8',
        'muted-gold': '#F08E2E',
        'earth-brown': '#B8392D',
        'forest-green': '#2C7A8A',
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
