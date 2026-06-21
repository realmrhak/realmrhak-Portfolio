/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
