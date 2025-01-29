/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4169E1',
        secondary: '#FF8C00',
        background: {
          DEFAULT: '#F5F5F5'
        },
        foreground: {
          DEFAULT: '#333333'
        }
      },
    },
  },
  plugins: [],
};
