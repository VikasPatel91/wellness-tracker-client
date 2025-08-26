// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Add this line to enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // You can extend with custom colors if needed
      },
    },
  },
  plugins: [],
};
