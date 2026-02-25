/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'drummer-bg': '#efe8cd',
        'drummer-ink': '#7f3f0e',
        'drummer-ink-light': '#a15b22',
        'drummer-grid': '#d9d1b6',
      },
      fontFamily: {
        'hand': ['"Patrick Hand"', 'cursive'],
      },
      boxShadow: {
        'drummer': '4px 4px 0px 0px rgba(127, 63, 14, 0.2)',
        'drummer-active': '1px 1px 0px 0px rgba(127, 63, 14, 0.2)',
      },
    },
  },
  plugins: [],
}
