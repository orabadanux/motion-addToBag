/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
      },
      keyframes: {
        anticipate: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-10px) scale(1.05) skewX(-3deg)', opacity: '1' },
        },
        fly: {
          '0%': { transform: 'translateY(-10px) scale(1.05)', opacity: '1' },
          '100%': { transform: 'translateY(140px) scale(0.5)', opacity: '0' },
        },
      },
      animation: {
        anticipate: 'anticipate 0.6s ease-out forwards',
        fly: 'fly 0.75s ease-in-out forwards',
      },
      
    },
  },
  plugins: [],
  future: {
    respectDefaultRingColorOpacity: false,
    disableColorPalette: true,
  },
  corePlugins: {
    preflight: true,
  },
};
