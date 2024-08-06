/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customColor1: '#1a1a1a',
        customColor2: '#ff6600',
        customColor3: '#00cc99',
        myGreen: {
          light: '#9BEC00',
          dark: '#06D001',
        },
      },
    },
  },
  plugins: [],
}
