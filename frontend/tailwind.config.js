/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['"League Spartan"', 'Inter', 'sans-serif'],
    },
  },
  plugins: [require('tailwindcss-animate')],
};