/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#F8F8F6',
        surface: '#FFFFFF',
        'text-primary': '#111111',
        'text-secondary': '#8E8E93',
        'text-tertiary': '#C7C7CC',
        border: '#EFEFEF',
        success: '#3A7D44',
        warning: '#B07830',
        danger: '#E05C5C',
        info: '#4A7BAF',
      },
      borderRadius: {
        sm: '10px',
        md: '14px',
        lg: '16px',
        xl: '20px',
        pill: '999px',
      },
    },
  },
  plugins: [],
};
