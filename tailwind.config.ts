/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Linha Reta brand tokens
        lr: {
          navy:     '#003A5D',
          'navy-deep': '#002438',
          ocean:    '#00A7D8',
          sky:      '#BFEFFF',
          sand:     '#F8F4EA',
          'sand-warm': '#F1EADA',
          sun:      '#FFC247',
          green:    '#2E8B57',
          coral:    '#FF7A59',
          ink:      '#0E1F2C',
          'ink-soft': '#3A4D5C',
        },
      },
      fontFamily: {
        display: ['League Spartan', 'sans-serif'],
        sans:    ['Poppins', 'system-ui', 'sans-serif'],
        serif:   ['Playfair Display', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-up':        'fade-up 0.6s cubic-bezier(.2,.7,.3,1) both',
        'hero-mask':      'hero-mask 1.1s cubic-bezier(.2,.7,.3,1) both',
        'route-dash':     'route-dash 6s linear infinite',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        'hero-mask': {
          from: { clipPath: 'inset(0 100% 0 0)', opacity: '0' },
          to:   { clipPath: 'inset(0 0 0 0)',    opacity: '1' },
        },
        'route-dash': {
          to: { strokeDashoffset: '-40' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}
