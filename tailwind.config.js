/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        heading: ["var(--font-heading)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        ocean: {
          50: 'var(--ocean-50)',
          100: 'var(--ocean-100)',
          200: 'var(--ocean-200)',
          300: 'var(--ocean-300)',
          400: 'var(--ocean-400)',
          500: 'var(--ocean-500)',
          600: 'var(--ocean-600)',
          700: 'var(--ocean-700)',
          800: 'var(--ocean-800)',
          900: 'var(--ocean-900)',
          950: 'var(--ocean-950)',
        },
        coral: {
          50: 'var(--coral-50)',
          100: 'var(--coral-100)',
          200: 'var(--coral-200)',
          300: 'var(--coral-300)',
          400: 'var(--coral-400)',
          500: 'var(--coral-500)',
          600: 'var(--coral-600)',
          700: 'var(--coral-700)',
          800: 'var(--coral-800)',
          900: 'var(--coral-900)',
          950: 'var(--coral-950)',
        },
        seagrass: {
          50: 'var(--seagrass-50)',
          100: 'var(--seagrass-100)',
          200: 'var(--seagrass-200)',
          300: 'var(--seagrass-300)',
          400: 'var(--seagrass-400)',
          500: 'var(--seagrass-500)',
          600: 'var(--seagrass-600)',
          700: 'var(--seagrass-700)',
          800: 'var(--seagrass-800)',
          900: 'var(--seagrass-900)',
          950: 'var(--seagrass-950)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'wave-pattern': "url('/images/wave-pattern.svg')",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        'accordion-up': {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require("tailwindcss-animate"),
  ],
} 