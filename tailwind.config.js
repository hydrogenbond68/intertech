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
        'harykims-green': {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
        },
        'harykims-white': {
          50: '#ffffff',
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#eeeeee',
          400: '#e0e0e0',
          500: '#bdbdbd',
          600: '#9e9e9e',
          700: '#757575',
          800: '#616161',
          900: '#424242',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    },
  },
  plugins: [],
}
