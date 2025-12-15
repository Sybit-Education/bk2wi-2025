import tailwindcss from '@tailwindcss/vite'
import flowbite from 'flowbite/plugin'
import forms from '@tailwindcss/forms'

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class', // Aktiviert Class-basiertes Dark Mode
  variants: {
    extend: {},
  },
  plugins: [tailwindcss(), flowbite(), forms()],
}
