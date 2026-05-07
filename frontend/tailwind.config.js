/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Rajdhani', 'Inter', 'sans-serif'],
      },
      colors: {
        f1: {
          red: '#E10600',
          dark: '#15151E',
          darkGray: '#1E1E28',
          gray: '#38383F',
          lightGray: '#52525E',
          accent: '#00D2BE',
          gold: '#FFD700',
          silver: '#C0C0C0',
          bronze: '#CD7F32',
        }
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(225, 6, 0, 0.5)',
        'glow-accent': '0 0 20px rgba(0, 210, 190, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, rgba(225, 6, 0, 0.1) 0%, rgba(0, 210, 190, 0.1) 100%)',
      },
    },
  },
  plugins: [],
}