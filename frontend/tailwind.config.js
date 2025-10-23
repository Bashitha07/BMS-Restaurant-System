/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
          black: {
            DEFAULT: '#111111',
            50: '#222222',
            100: '#333333',
            200: '#444444',
            300: '#555555',
            400: '#666666',
            500: '#111111',
            600: '#000000',
          },
          red: {
            DEFAULT: '#d90429',
            50: '#ffccd5',
            100: '#ffb3c1',
            200: '#ff758f',
            300: '#ff4d6d',
            400: '#d90429',
            500: '#a8001a',
            600: '#800013',
          },
          orange: {
            DEFAULT: '#ff6600', // more vibrant orange
            50: '#fff2e6',
            100: '#ffd9b3',
            200: '#ffb366',
            300: '#ff9933',
            400: '#ff6600', // vibrant
            500: '#e65c00',
            600: '#b34700',
          },
          white: {
            DEFAULT: '#ffffff',
            50: '#f9f9f9',
            100: '#f0f0f0',
            200: '#e0e0e0',
            300: '#cccccc',
            400: '#b3b3b3',
            500: '#ffffff',
          },
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

