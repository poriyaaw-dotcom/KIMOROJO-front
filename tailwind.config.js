/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['BYekan Main', 'Vazirmatn', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        bold: ['BYekan Bold', 'Vazirmatn', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'], // Elegant fallback for English headings
      },
    },
  },
  plugins: [],
}