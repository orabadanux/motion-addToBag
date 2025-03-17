/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ Scans all relevant files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
