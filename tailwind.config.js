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
        brand: {
          50: 'var(--color-brand-50)',
          100: 'var(--color-brand-100)',
          500: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
        },
        ink: {
          400: 'var(--color-ink-400)',
          500: 'var(--color-ink-500)',
          700: 'var(--color-ink-700)',
          900: 'var(--color-ink-900)',
        },
        line: 'var(--color-border)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          soft: 'var(--color-surface-soft)',
        },
        status: {
          success: 'var(--color-success)',
          'success-soft': 'var(--color-success-soft)',
          info: 'var(--color-info)',
          'info-soft': 'var(--color-info-soft)',
          warning: 'var(--color-warning)',
          'warning-soft': 'var(--color-warning-soft)',
          danger: 'var(--color-danger)',
          'danger-soft': 'var(--color-danger-soft)',
        },
      },
      maxWidth: {
        container: 'var(--container-width)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate3d(0, 0, 0, 0deg)' },
          '50%': { transform: 'rotate3d(0, 1, 0, 25deg)' },
        }
      },
      animation: {
        wiggle: 'wiggle 6s ease-in-out infinite',
      },
      screens: {
        'print': { 'raw': 'print' },
      }
    },
  },
  plugins: [],
}
