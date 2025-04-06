/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ Scans all relevant files
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
      },
      keyframes: {
        'fly-into-bag': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(100px) scale(0.5)', opacity: '0' },
        },
      },
      animation: {
        'fly-into-bag': 'fly-into-bag 0.75s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
