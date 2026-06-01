/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#07090f',
          800: '#0b0e1a',
          700: '#0f1420',
          600: '#141b2d',
          500: '#1a2438',
          400: '#1e2d4a',
          300: '#253660',
        },
        primary: '#00c6ff',
        'primary-dim': '#0099cc',
        'primary-glow': 'rgba(0,198,255,0.15)',
        value:   '#22c55e',
        danger:  '#ef4444',
        warn:    '#f59e0b',
      },
      fontFamily: {
        sans:   ['Poppins', 'sans-serif'],
        impact: ['Impact', 'Arial Narrow', 'sans-serif'],
      },
      boxShadow: {
        glow:    '0 0 20px rgba(0,198,255,0.25), 0 0 60px rgba(0,198,255,0.08)',
        'glow-sm': '0 0 10px rgba(0,198,255,0.2)',
        'glow-value': '0 0 20px rgba(34,197,94,0.2)',
        card:    '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        deep:    '0 8px 32px rgba(0,0,0,0.6)',
      },
      backdropBlur: {
        glass: '12px',
      },
      backgroundImage: {
        'glass':        'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'glass-card':   'linear-gradient(135deg, rgba(0,198,255,0.06) 0%, rgba(0,0,0,0.2) 100%)',
        'glow-border':  'linear-gradient(135deg, rgba(0,198,255,0.4), rgba(0,198,255,0.1))',
      },
    },
  },
  plugins: [],
}
