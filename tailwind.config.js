/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        accentTeal: "#00d4d4",
        accentCyan: "#00f5ff",
        accentViolet: "#9c4dff"
      }
    }
  },
  plugins: [],
};
