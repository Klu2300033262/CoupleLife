/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff4f9a',
          light: '#ff85b3'
        },
        background: '#fff7fb',
        dark: '#1f2937',
        gray: {
          light: '#6b7280'
        },
        borderPink: '#ffd1e6'
      },
      boxShadow: {
        'romantic': '0 10px 30px rgba(255, 79, 154, 0.08)',
      },
      borderRadius: {
        'xl': '24px',
        'lg': '18px',
      }
    },
  },
  plugins: [],
}
