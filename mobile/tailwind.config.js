/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#004532',
        'primary-container': '#065f46',
        secondary: '#904d00',
        'secondary-container': '#fe932c',
        background: '#f9f9ff',
        surface: '#f9f9ff',
        'on-surface': '#111c2d',
        'on-surface-variant': '#3f4944',
        error: '#ba1a1a',
      },
    },
  },
  plugins: [],
}
