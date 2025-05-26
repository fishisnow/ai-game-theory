/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'cyber-blue': '#00ffff',
        'cyber-purple': '#ff00ff',
        'cyber-green': '#00ff88',
        'cyber-yellow': '#ffff00',
        'dark-bg': '#0a0a0a',
        'dark-secondary': '#1a1a2e',
        'dark-tertiary': '#16213e',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
      },
      animation: {
        'grid-move': 'gridMove 20s linear infinite',
        'title-glow': 'titleGlow 3s ease-in-out infinite alternate',
        'pulse-custom': 'pulse 2s infinite',
        'rotate-slow': 'rotate 10s linear infinite',
      },
      keyframes: {
        gridMove: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
        titleGlow: {
          '0%': { filter: 'brightness(1)' },
          '100%': { filter: 'brightness(1.3)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
} 