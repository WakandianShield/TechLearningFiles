/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f0f0f0',
          100: '#2a2a2a',
          200: '#242424',
          300: '#1e1e1e',
          400: '#1a1a1a',
          500: '#141414',
          600: '#0f0f0f',
          700: '#0a0a0a',
          800: '#050505',
          900: '#000000',
        },
        accent: {
          cyan: '#64ffda',
          green: '#3fb950',
          yellow: '#ffe066',
          red: '#ff5252',
          purple: '#bb86fc',
          blue: '#82b1ff',
        },
        primary: {
          50: '#e0fff5',
          100: '#b3ffea',
          200: '#80ffdb',
          300: '#64ffda',
          400: '#4dd9b4',
          500: '#3fb9a0',
          600: '#2d9980',
          700: '#1a7960',
          800: '#0d5940',
          900: '#003920',
          950: '#001f10',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Press Start 2P"', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(100, 255, 218, 0.2), 0 0 20px rgba(100, 255, 218, 0.1)' },
          '100%': { boxShadow: '0 0 10px rgba(100, 255, 218, 0.4), 0 0 40px rgba(100, 255, 218, 0.2)' },
        },
      },
    },
  },
  plugins: [],
};
