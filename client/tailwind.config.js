/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens:{
      'movil': '360px',
      'tablet': '640px',
      'desktop': '800px',
      'desktop-md':'1024px',
      'desktop-lg':'1280px',
      'desktop-xl':'1600px',

    },
    extend: {},
  },
  plugins: [],
}