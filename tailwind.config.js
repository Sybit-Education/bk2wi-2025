import tailwindcss from '@tailwindcss/vite'
import flowbite from 'flowbite/plugin'
import forms from '@tailwindcss/forms'

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [tailwindcss(), flowbite(), forms()],
}
