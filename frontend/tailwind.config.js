/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        'primary-pink': '#ff4f9a',
        'soft-pink': '#ff85b3',
        background: '#fff7fb',
        dark: '#1f2937',
        gray: {
          light: '#6b7280'
        },
        'border-pink': '#ffd1e6',
        'card-white': '#ffffff'
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
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
