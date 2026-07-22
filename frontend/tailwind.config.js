/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0F1A30",
          900: "#1B2A4A",
          800: "#233657",
          700: "#2D4470",
        },
        gold: {
          400: "#F0B74D",
          500: "#E8A33D",
          600: "#C8862A",
        },
        canvas: "#F7F8FA",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
