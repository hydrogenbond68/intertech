/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'harykims': {
          50: '#f0faf0',
          100: '#d4f0d4',
          200: '#a9e1a9',
          300: '#7dcc7d',
          400: '#52b852',
          500: '#2ea32e',
          600: '#1f8a1f',
          700: '#167016',
          800: '#0d560d',
          900: '#063d06',
          950: '#022402',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
