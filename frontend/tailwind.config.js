/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#111939', // even darker blue main
          50:  '#e6eaf6',
          100: '#b3c0dd',
          200: '#8096c4',
          300: '#274080',
          400: '#162046',
          500: '#111939', // even darker blue main
          600: '#0d122b',
          700: '#080b1e',
          800: '#050713',
          900: '#02030a',
        },
        accent: {
          DEFAULT: '#ffd600', // vibrant yellow main
          50:  '#fffbea', // very light gold
          100: '#fff9db',
          200: '#fff6b7',
          300: '#fff3b0',
          400: '#ffd600', // strong yellow
          500: '#ffcc00', // classic yellow
          600: '#e6c200',
          700: '#bfa100',
          800: '#a78900',
          900: '#8f7100',
        },
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

