/** @type {import('tailwindcss').Config} */
// import scrollbar from 'tailwind-scrollbar';
export default {
  content: [
    "./index.html", // se você usa Vite
    "./src/**/*.{js,jsx,ts,tsx}", // cobre todos os tipos possíveis de componentes
  ],
  theme: {
    extend: {
      colors: {
        myBege: '#FFF9EF'
      },
      screens: {
        'max-sm': {'max': '599px'}, // Telas ≤ 599px
      },
    },
  },
  plugins: [],
};