import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        bebas: ['var(--font-bebas)', 'Bebas Neue', 'cursive'],
      },
      colors: {
        pitch: '#1a3a1a',
        chalk: '#f0ede6',
        dim: '#b8b4aa',
        drunk: '#ff6b35',
      },
      animation: {
        'drink-pulse': 'drink-pulse 1.8s ease-in-out infinite',
      },
      keyframes: {
        'drink-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
      },
    },
  },
  plugins: [],
}

export default config
